'use client'

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { TripData } from '@/types/trip'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!

interface TripMapProps {
  tripData: Partial<TripData> | null
}

export default function TripMap({ tripData }: TripMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    if (map.current) return; // initialize map only once
    if (!mapContainer.current) return; // wait for the container to be available

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-98.5795, 39.8283], // Center of USA
      zoom: 3
    });

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current || !mapLoaded || !tripData || !tripData.stops || tripData.stops.length < 2) return;

    // Remove existing markers and route
    const existingMarkers = document.querySelectorAll('.mapboxgl-marker');
    existingMarkers.forEach(marker => marker.remove());

    if (map.current.getLayer('route')) {
      map.current.removeLayer('route');
    }
    if (map.current.getSource('route')) {
      map.current.removeSource('route');
    }

    // Add markers for all stops
    const bounds = new mapboxgl.LngLatBounds();
    tripData.stops.forEach((stop, index) => {
      const marker = new mapboxgl.Marker({ color: index === 0 ? '#00FF00' : (index === tripData.stops!.length - 1 ? '#FF0000' : '#0000FF') })
        .setLngLat([stop.coordinates.lng, stop.coordinates.lat])
        .setPopup(new mapboxgl.Popup().setHTML(`<h3>${index === 0 ? 'Origin' : (index === tripData.stops!.length - 1 ? 'Destination' : 'Stop')} ${index + 1}: ${stop.name}</h3>`))
        .addTo(map.current!);
      bounds.extend([stop.coordinates.lng, stop.coordinates.lat]);
    });

    // Get directions
    const coordinates = tripData.stops.map(stop => `${stop.coordinates.lng},${stop.coordinates.lat}`).join(';');
    fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`)
      .then(response => response.json())
      .then(data => {
        const route = data.routes[0].geometry.coordinates;
        const geojson: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties> = {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: route
          }
        };

        // Add route to the map
        map.current!.addSource('route', {
          type: 'geojson',
          data: geojson
        });

        map.current!.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#888',
            'line-width': 8
          }
        });

        // Add travel duration markers
        let cumulativeDistance = 0;
        interface Leg {
          distance: number;
          duration: number;
        }

        interface Route {
          distance: number;
          legs: Leg[];
          geometry: {
            coordinates: [number, number][];
          };
        }

        data.routes[0].legs.forEach((leg: Leg, index: number) => {
          if (index < tripData.stops!.length - 1 && leg && leg.duration) {
            cumulativeDistance += leg.distance;
            const midpoint = route[Math.floor(cumulativeDistance / data.routes[0].distance * (route.length - 1))];
            
            // Calculate hours and minutes
            const hours = Math.floor(leg.duration / 3600);
            const minutes = Math.round((leg.duration % 3600) / 60);
            
            // Format the time string
            let timeString = '';
            if (hours > 0) {
              timeString += `${hours} hr `;
            }
            if (minutes > 0 || hours === 0) {
              timeString += `${minutes} min`;
            }

            // Create a custom HTML element for the marker
            const el = document.createElement('div');
            el.className = 'custom-marker';
            el.style.background = 'white';
            el.style.width = 'auto';
            el.style.height = 'auto';
            el.style.borderRadius = '3px';
            el.style.padding = '5px';
            el.style.fontSize = '12px';
            el.style.fontWeight = 'bold';
            el.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
            el.innerHTML = timeString;

            // Add marker to map
            new mapboxgl.Marker(el)
              .setLngLat(midpoint)
              .addTo(map.current!);
          }
        });

        // Fit the map to show the full route
        map.current!.fitBounds(bounds, {
          padding: { top: 50, bottom: 50, left: 50, right: 50 }
        });
      });

  }, [tripData, mapLoaded]);

  return <div ref={mapContainer} className="h-[400px] w-full rounded-lg" />
}

