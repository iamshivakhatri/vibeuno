"use client";

import { Cloud, Thermometer, ShirtIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { WeatherInfo, DressCode } from "@/lib/explore/types";

interface WeatherDressProps {
  weather?: WeatherInfo;
  dressCode?: DressCode;
}

export function WeatherDress({ weather, dressCode }: WeatherDressProps) {
  if (!weather || !dressCode) {
    return null;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Cloud className="h-5 w-5" />
            <h3 className="font-semibold">Today&apos;s Weather</h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-4xl">{weather.icon}</div>
            <div>
              <div className="flex items-center gap-2">
                <Thermometer className="h-4 w-4" />
                <span className="text-2xl font-semibold">{weather.temperature}°C</span>
              </div>
              <p className="text-muted-foreground">{weather.condition}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <ShirtIcon className="h-5 w-5" />
            <h3 className="font-semibold">What to Wear</h3>
          </div>
          <ul className="space-y-2 mb-4">
            {dressCode.recommendations.map((rec, index) => (
              <li key={index} className="text-sm text-muted-foreground">
                • {rec}
              </li>
            ))}
          </ul>
          <p className="text-sm italic text-muted-foreground">{dressCode.tips}</p>
        </CardContent>
      </Card>
    </div>
  );
}