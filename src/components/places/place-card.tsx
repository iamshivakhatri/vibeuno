'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, FolderOpen } from 'lucide-react';
import { useState } from 'react';
import { voteForPlace } from '@/actions/place';
import { useAuth } from '@/lib/auth';
import { toast } from '@/hooks/use-toast';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { hasUserVotedForPlace, getPlaceVoteCount } from '@/actions/user';
import { Badge } from '../ui/badge';

interface PlaceCardProps {
  place: {
    id: string;
    name: string;
    description: string;
    imageUrl?: string | null | undefined;
    image?: string[];
    _count: { votes: number };
    city: string;
    category?: string;
  };
  viewMode?: 'grid' | 'list';
}

export function PlaceCard({ place, viewMode = 'grid' }: PlaceCardProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();

  console.log('place at the ', place);

  // Query to check if user has voted
  const { data: hasVoted } = useQuery({
    queryKey: ['hasVoted', place.id, user?.id],
    queryFn: () => hasUserVotedForPlace(place.id, user?.id || ''),
    enabled: !!user,
  });

  // Query for vote count
  const { data: voteCount = place._count.votes } = useQuery({
    queryKey: ['voteCount', place.id],
    queryFn: () => getPlaceVoteCount(place.id),
  });


  // Vote mutation
  const voteMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');
      return await voteForPlace(place.id, user.id);
    },
    onMutate: async () => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['voteCount', place.id] });
      await queryClient.cancelQueries({ queryKey: ['hasVoted', place.id, user?.id] });

      // Snapshot previous values
      const previousVoteCount = queryClient.getQueryData(['voteCount', place.id]);
      const previousHasVoted = queryClient.getQueryData(['hasVoted', place.id, user?.id]);

      // Optimistically update
      queryClient.setQueryData(['voteCount', place.id], (old: number) => 
        previousHasVoted ? old - 1 : old + 1
      );
      queryClient.setQueryData(['hasVoted', place.id, user?.id], !previousHasVoted);

      return { previousVoteCount, previousHasVoted };
    },
    onError: (err, variables, context) => {
      // Revert optimistic updates on error
      queryClient.setQueryData(['voteCount', place.id], context?.previousVoteCount);
      queryClient.setQueryData(['hasVoted', place.id, user?.id], context?.previousHasVoted);
      toast({ title: "Failed to vote", variant: "destructive" });
    },
    onSuccess: (data) => {
      toast({ 
        title: data.vote === 1 ? "Vote recorded!" : "Vote removed!" 
      });
    },
    onSettled: () => {
      // Refetch to ensure sync
      queryClient.invalidateQueries({ queryKey: ['voteCount', place.id] });
      queryClient.invalidateQueries({ queryKey: ['hasVoted', place.id, user?.id] });
    },
  });

  const handleVote = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast({ title: "Please sign in to vote", variant: "destructive" });
      return;
    }
    voteMutation.mutate();
  };

  const cardClassName = viewMode === 'list' 
    ? "flex flex-row overflow-hidden group md:h-48"
    : "overflow-hidden group";

  const imageClassName = viewMode === 'list'
    ? "w-1/3 relative"
    : "aspect-[4/3] relative";

  return (
    // <Card 
    //   className={cardClassName}
    //   onClick={() => router.push(`/places/${place.id}`)}
    //   role="button"
    // >
    //   <div className={`${imageClassName} relative`}>
    //   <Image
    //     src={place.imageUrl || `https://source.unsplash.com/featured/?${encodeURIComponent(place.name)},landmark`}
    //     alt={place.name}
    //     className="object-contain group-hover:scale-105 transition-transform duration-300"
    //     fill
    //     sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    //   />
 
    //  </div>

  

    //   <div className={viewMode === 'list' ? 'flex-1' : ''}>
    //     <CardContent className="p-4">
    //       <h3 className="text-lg font-semibold mb-1">{place.name}</h3>
    //       <p className="text-sm text-muted-foreground mb-2">{place.city}</p>
    //       <p className="text-sm line-clamp-2">{place.description }</p>
    //     </CardContent>
    //     <CardFooter className="p-4 pt-0 flex justify-between">
    //       <div>
    //       <Button
    //         variant={hasVoted ? "secondary" : "outline"}
    //         size="sm"
    //         onClick={handleVote}
    //         disabled={voteMutation.isPending}
    //         className="flex items-center gap-2"
    //       >
    //         <Heart 
    //           className={`h-4 w-4 ${hasVoted ? 'fill-primary text-primary' : ''}`} 
    //         />
    //         <span>{voteCount}</span>
    //       </Button>
    //       </div>
    //       <Button
    //         variant={hasVoted ? "secondary" : "outline"}
    //         size="sm"
    //         onClick={handleVote}
    //         disabled={voteMutation.isPending}
    //         className="flex items-center gap-2"
    //       >
    //          <span> {place?.image ? `${place.image.length} photos` : 'No photos'}</span>


    //       </Button>   
   
    //     </CardFooter>
    //   </div>
    // </Card>
    <div
    key={place.id}
    className="group relative aspect-square overflow-hidden rounded-lg bg-muted cursor-pointer"
    onClick={() => router.push(`/places/${place.id}`)}
  >
    {/* Image */}
    <div className="relative w-full h-full">
      <Image
        src={
          place.imageUrl || 
          `https://source.unsplash.com/featured/?${encodeURIComponent(place.name)},landmark`
        }
        alt={place.name}
        className="object-cover transition-transform group-hover:scale-105 duration-300"
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  
    {/* Bottom Right: Number of Photos & Album Indicator */}
    <div className="absolute bottom-4 right-4 flex items-center gap-1 text-white bg-black/60 px-2 py-1 rounded-md text-sm shadow-md">
      <span>{place?.image ? `${place.image.length} Photos` : 'No Photos'}</span>
      <FolderOpen className="w-4 h-4 text-white/80" />
    </div>
  
    {/* Hover Info */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <div className="absolute bottom-0 p-4 text-white">
        {/* Place Name */}
        <h3 className="text-lg font-semibold">{place.name}</h3>
  
        {/* Additional Info */}
        <p className="text-sm text-white/80">{place.city}</p>
        <p className="text-sm line-clamp-2 mt-1">{place.description}</p>
        <div className="flex gap-2 mt-2">

          <Badge key={place.category? place.category : ""} variant="secondary" className="bg-white/20">
            {place.category}
          </Badge>

        </div>
      </div>
    </div>
  </div>
  

  );
}