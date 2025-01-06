export function getWeatherIcon(iconCode: string): string {
  const iconMap: Record<string, string> = {
    '01d': '☀️',
    '01n': '🌙',
    '02d': '⛅',
    '02n': '☁️',
    '03d': '☁️',
    '03n': '☁️',
    '04d': '☁️',
    '04n': '☁️',
    '09d': '🌧️',
    '09n': '🌧️',
    '10d': '🌦️',
    '10n': '🌧️',
    '11d': '⛈️',
    '11n': '⛈️',
    '13d': '🌨️',
    '13n': '🌨️',
    '50d': '🌫️',
    '50n': '🌫️'
  };
  return iconMap[iconCode] || '☀️';
}

export function getBestTimeToVisit(latitude: number): string {
  const abs_lat = Math.abs(latitude);
  if (abs_lat < 23.5) {
    return 'November to February (Dry Season)';
  } else if (abs_lat < 45) {
    return 'Spring (March-May) or Fall (September-November)';
  } else {
    return 'June to August (Summer)';
  }
}

export function getDefaultDressCode(temperature: number) {
  if (temperature > 25) {
    return {
      recommendations: [
        'Light, breathable clothing',
        'Sun hat',
        'Sunglasses',
        'Comfortable walking shoes',
        'Sunscreen'
      ],
      tips: 'Stay hydrated and protect yourself from the sun.'
    };
  } else if (temperature > 15) {
    return {
      recommendations: [
        'Light layers',
        'Long sleeve shirts',
        'Light jacket',
        'Comfortable shoes',
        'Umbrella'
      ],
      tips: 'The weather is mild. Layers are recommended as temperatures may vary throughout the day.'
    };
  } else {
    return {
      recommendations: [
        'Warm jacket',
        'Sweater or fleece',
        'Long pants',
        'Warm socks',
        'Winter accessories'
      ],
      tips: 'Bundle up and dress in layers to stay warm.'
    };
  }
}