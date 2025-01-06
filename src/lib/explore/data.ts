import { PlaceDetails } from './types';

export const PLACE_DATA: Record<string, PlaceDetails> = {
  "eiffel tower": {
    name: "Eiffel Tower",
    shortDescription: "Iconic symbol of Paris and one of the world's most famous landmarks",
    longDescription: "The Eiffel Tower, completed in 1889, stands at 324 meters tall and offers breathtaking views of Paris. This architectural marvel attracts millions of visitors each year and features restaurants, observation decks, and a fascinating history.",
    bestTimeToVisit: "Early morning or late evening",
    knownFor: "Architecture, Views, Romance",
    language: "French",
    photos: [
      {
        imageUrl: "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?auto=format&fit=crop&q=80&w=2401",
        author: "Thomas H.",
        likes: 15234,
        caption: "Sunset view from Trocadéro"
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&q=80&w=3387",
        author: "Marie L.",
        likes: 12453,
        caption: "Night lights"
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1590114538379-4e4b6377b5b2?auto=format&fit=crop&q=80&w=2970",
        author: "Jean P.",
        likes: 10876,
        caption: "Spring morning"
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1542654071-7ded22488685?auto=format&fit=crop&q=80&w=3387",
        author: "Sophie M.",
        likes: 9432,
        caption: "Autumn view"
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1460904577954-8fadb262612c?auto=format&fit=crop&q=80&w=2940",
        author: "Pierre D.",
        likes: 8765,
        caption: "First light"
      }
    ],
    weather: {
      temperature: 22,
      condition: "Partly Cloudy",
      icon: "☁️"
    },
    dressCode: {
      recommendations: [
        "Light layers for variable temperatures",
        "Comfortable walking shoes",
        "Smart casual for restaurants",
        "Light jacket for evening",
        "Sun protection"
      ],
      tips: "Paris is a fashion-conscious city. Opt for classic, well-fitted clothing in neutral colors. Avoid overly casual items like athletic wear or flip-flops."
    },
    nearbyPlaces: [
      {
        title: "Trocadéro",
        description: "Best view of the Eiffel Tower",
        imageUrl: "https://images.unsplash.com/photo-1431274172761-fca41d930114?auto=format&fit=crop&q=80&w=2970",
        likes: 1234,
        author: "Marie D."
      },
      {
        title: "Champ de Mars",
        description: "Perfect picnic spot",
        imageUrl: "https://images.unsplash.com/photo-1522093007474-d86e9bf7ba6f?auto=format&fit=crop&q=80&w=2400",
        likes: 892,
        author: "Jean P."
      },
      {
        title: "Les Invalides",
        description: "Historic army museum and Napoleon's tomb",
        imageUrl: "https://images.unsplash.com/photo-1590491424212-e6e6712a8512?auto=format&fit=crop&q=80&w=2974",
        likes: 756,
        author: "Pierre L."
      }
    ],
    dining: [
      {
        title: "Le Jules Verne",
        description: "Michelin-starred restaurant in the tower",
        imageUrl: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2970",
        likes: 1567,
        author: "Sophie M."
      },
      {
        title: "Bistrot Chez L'Ami Louis",
        description: "Classic French bistro",
        imageUrl: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80&w=2970",
        likes: 1023,
        author: "Lucas R."
      },
      {
        title: "Café Constant",
        description: "Traditional French cuisine",
        imageUrl: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&q=80&w=2971",
        likes: 891,
        author: "Emma B."
      }
    ],
    activities: [
      {
        title: "Summit Visit",
        description: "Visit the top level of the tower",
        imageUrl: "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?auto=format&fit=crop&q=80&w=2401",
        likes: 2341,
        author: "Thomas H."
      },
      {
        title: "Night Light Show",
        description: "Watch the tower sparkle",
        imageUrl: "https://images.unsplash.com/photo-1541233349642-6e425fe6190e?auto=format&fit=crop&q=80&w=2974",
        likes: 1892,
        author: "Claire V."
      },
      {
        title: "Seine River Cruise",
        description: "Scenic boat tours along the Seine",
        imageUrl: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=2970",
        likes: 1456,
        author: "Antoine D."
      }
    ]
  }
};