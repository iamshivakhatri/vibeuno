'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp } from 'lucide-react';
import { useState } from 'react';
import { voteForPlace } from '@/actions/place';
import { useAuth } from '@/lib/auth';
import { toast } from '@/hooks/use-toast';
import Image from 'next/image';

interface PlaceCardProps {
  place: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    _count: { votes: number };
    city: string;
  };
}

export function PlaceCard({ place }: PlaceCardProps) {
  const { user } = useAuth();
  console.log('User:', user?.id);
  console.log('Place:', place);
  const [votes, setVotes] = useState(place._count.votes);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async () => {
    if (!user) {
      toast({ title: "Please sign in to vote", variant: "destructive" });
      return;
    }

    if (!hasVoted && !isVoting) {
      setIsVoting(true);
      try {
        const voteCount = await voteForPlace(place.id, user.id);
        console.log('Vote:', voteCount); 
        setVotes(voteCount.vote);
        if(voteCount.vote == 1) {
          toast({ title: "Vote recorded!" });
        }else{
          toast({ title: "Vote removed!" });
        }



      } catch (error) {
        toast({ title: "Failed to vote", variant: "destructive" });
      } finally {
        setIsVoting(false);
      }
    }
  };

  return (
    <Card className="overflow-hidden group">
      <div className="aspect-[4/3] relative overflow-hidden">
        <Image
          src={place.imageUrl || `https://source.unsplash.com/featured/?${encodeURIComponent(place.name)},landmark`}
          alt={place.name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          width={800}
          height={600}
        />
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-1">{place.name}</h3>
        <p className="text-sm text-muted-foreground mb-2">{place.city}</p>
        <p className="text-sm line-clamp-2">{place.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button
          variant={hasVoted ? "secondary" : "outline"}
          size="sm"
          onClick={handleVote}
          disabled={hasVoted || isVoting}
          className="flex items-center gap-2"
        >
          <ThumbsUp className="h-4 w-4" />
          <span>{votes}</span>
        </Button>
        <Button variant="link" className="text-sm">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}