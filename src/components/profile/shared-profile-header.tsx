'use client';

import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MapPin, Award } from 'lucide-react';

type SharedProfileHeaderProps = {
  user: {
    id: string;
    name: string;
    placesCount: number;
    totalPoints: number;
  };
};

export function SharedProfileHeader({ user }: SharedProfileHeaderProps) {
  return (
    <div className="relative">
      <div className="relative h-64 bg-gradient-to-r from-rose-400 to-purple-400">
        <div className="absolute bottom-0 w-full">
          <svg viewBox="0 0 1440 320" className="w-full">
            <path
              fill="currentColor"
              className="text-rose-50"
              d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </div>
      
      <div className="container">
        <div 

          className="relative -mt-32 mb-8"
        >
          <div className="p-6 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl">
            <div className="flex flex-col md:flex-row gap-8">
              <div 
                className="relative"
              >
                <div className="w-40 h-40 rounded-full bg-gradient-to-r from-rose-400 to-purple-400 p-1">
                  <Avatar className="w-full h-full border-4 border-background">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  </Avatar>
                </div>
                <Badge className="absolute bottom-2 right-0 bg-gradient-to-r from-rose-400 to-purple-400">
                  <Award className="w-3 h-3 mr-1" />
                  Explorer
                </Badge>
              </div>

              <div className="flex-1">
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <p className="mt-2 text-muted-foreground">
                  Travel enthusiast | Photography lover | Adventure seeker
                </p>

                <div className="mt-6 flex gap-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-2xl font-semibold">{user.placesCount}</p>
                      <p className="text-sm text-muted-foreground">Places Visited</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-2xl font-semibold">{user.totalPoints}</p>
                      <p className="text-sm text-muted-foreground">Points Earned</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
