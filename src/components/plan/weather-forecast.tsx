"use client";

import { useEffect, useState } from 'react';
import { Cloud, Thermometer, Wind } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface WeatherForecastProps {
  location: string;
}

interface WeatherData {
  date: string;
  temp: number;
  description: string;
  icon: string;
}

export function WeatherForecast({ location }: WeatherForecastProps) {
  const [forecast, setForecast] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!location) return;

    async function getForecast() {
      setLoading(true);
      try {
        // First get coordinates
        const geoResponse = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${process.env.NEXT_PUBLIC_OPENCAGE_API_KEY}`
        );
        const geoData = await geoResponse.json();

        if (geoData.results?.[0]) {
          const { lat, lng } = geoData.results[0].geometry;
          
          // Then get weather forecast
          const weatherResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&units=metric&appid=${process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY}`
          );
          const weatherData = await weatherResponse.json();

          // Process forecast data
          const processed = weatherData.list
            .filter((_: any, index: number) => index % 8 === 0) // Get one reading per day
            .slice(0, 5) // Get 5 days
            .map((item: any) => ({
              date: new Date(item.dt * 1000).toLocaleDateString(),
              temp: Math.round(item.main.temp),
              description: item.weather[0].description,
              icon: item.weather[0].icon
            }));

          setForecast(processed);
        }
      } catch (error) {
        console.error('Error fetching weather:', error);
      } finally {
        setLoading(false);
      }
    }

    getForecast();
  }, [location]);

  if (!location) return null;

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Cloud className="h-5 w-5" />
        <h2 className="font-semibold">5-Day Weather Forecast</h2>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
      ) : (
        <div className="grid grid-cols-5 gap-2">
          {forecast.map((day) => (
            <div key={day.date} className="text-center">
              <p className="text-sm font-medium">{day.date}</p>
              <img
                src={`https://openweathermap.org/img/wn/${day.icon}.png`}
                alt={day.description}
                className="mx-auto"
              />
              <p className="text-lg font-semibold">{day.temp}°C</p>
              <p className="text-xs text-muted-foreground">{day.description}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}