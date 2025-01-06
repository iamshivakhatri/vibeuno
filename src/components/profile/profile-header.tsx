'use client';

import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Share2, MapPin, Award } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { currentUser } from '@clerk/nextjs/server';




type ProfileHeaderProps = {
  user: {

    id: string;

    clerkId: string | null;

    email: string;

    name: string;

    createdAt: string;

    placesCount: number;

    votesCount: number;

    totalPoints: number;

  };
};



export function ProfileHeader(user: ProfileHeaderProps | null) {
  const [copied, setCopied] = useState(false);

  if (!user) {
    return null;
  }

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast({ title: "Profile link copied to clipboard!" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      {/* Cover Image */}
      <div className="h-64 bg-gradient-to-r from-primary/20 to-primary/10" />
      
      <div className="container">
        <div className="relative -mt-20 pb-8 flex flex-col md:flex-row gap-8">
          {/* Avatar */}
          <Avatar className="h-40 w-40 border-4 border-background">
            <img 
              src={ `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.user.name}`} 
              alt={user.user.name} 
            />
          </Avatar>

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold">{user.user.name}</h1>
                {/* {user.bio && (
                  <p className="mt-2 text-muted-foreground">{user.bio}</p>
                )} */}
                This is a bio
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4 mr-2" />
                {copied ? 'Copied!' : 'Share Profile'}
              </Button>
            </div>

            <div className="mt-6 flex gap-6">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-semibold">{user.user.placesCount}</p>
                  <p className="text-sm text-muted-foreground">Places Visited</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-semibold">{user.user.totalPoints}</p>
                  <p className="text-sm text-muted-foreground">Points Earned</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}