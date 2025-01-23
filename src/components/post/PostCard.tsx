import React, { useState } from "react";
import {
  MapPin,
  Users,
  TrendingUp,
  Camera,
  Bookmark,
  MessageSquare,
  Send,
  ThumbsUp,
  Link,
  Heart,
  Trash,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { hasUserVotedForPlace, getPlaceVoteCount } from "@/actions/user";
import { Badge } from "@/components/ui/badge";
import { createComment } from "@/actions/place";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteComment } from "@/actions/place";
import { useMutationData, useMutationDataState } from "@/hooks/useMutationData";
import { voteForPlace } from "@/actions/place";
import { toast } from "sonner"

type Place = {
  id: string;
  name: string | null;
  caption?: string | null;
  description?: string | null;
  image?: string[];
  imageUrl?: string | null;
  category?: string | null;
  numVotes: number | 0;
  comments: Comment[];
  user: User;
  createdAt: string;
};

type User = {
  id: string;
  name?: string;
  profileUrl?: string;
  occupation?: string;
};

type Comment = {
  id: string;
  content: string;
  user: User;
  createdAt: string;
  likes?: number;
};

type PostCardProps = {
  place: Place;

  profileUrl: string | null | undefined;

  userId: string;

  clerkId: string | undefined;
};

const PostCard = ({ place, profileUrl, userId, clerkId }: PostCardProps) => {


  const [selectedCategory, setSelectedCategory] = useState("All");
  const [newComment, setNewComment] = useState("");
  const queryClient = useQueryClient();

  const {mutate:addComment , isPending: isAddingCommentPending} = useMutationData(
    ['add-comment'],
    (newComment: {
        content: string;
        userId: string;
        placeId: string;
      })=>( createComment(newComment)),
    'placesFromCity',
    ()=>setNewComment("")
    
  )

//   const {latestVariables} = useMutationDataState(['handle-vote']) // for optimistic ui

const {mutate:mutateDelete , isPending: isDeletingCommentPending} = useMutationData(
    ['delete-comment'],
    (commentId: string) => deleteComment(commentId),
    'placesFromCity',    
  )


const handleComment = (placeId: string) => {
    if (!newComment.trim()) return;
    const content = newComment.trim();
    addComment({
      content,
      userId,
      placeId,
    });
  };



  // Query to check if user has voted
  const { data: hasVoted } = useQuery({
    queryKey: ["hasVoted", place.id],
    queryFn: () => hasUserVotedForPlace(place.id, userId || ""),
  });


  const { data: voteCount = place.numVotes } = useQuery({
    queryKey: ['vote-count', place.id],
    queryFn: () => getPlaceVoteCount(place.id),
  });


const { mutate: addOrRemoveVote } = useMutation(
    {
      mutationKey: ["handle-vote"],
      mutationFn: ({ placeId, userId }: { placeId: string; userId: string; }) =>
        voteForPlace(placeId, userId),
      onMutate: async ({ placeId, userId }) => {
        // Capture the current state before mutation occurs
        const previousHasVoted = queryClient.getQueryData(["hasVoted", placeId]);
        const previousVoteCount = queryClient.getQueryData(["vote-count", placeId]);
  
        // Optimistically update the state
        queryClient.setQueryData(["hasVoted", placeId], !hasVoted); // Toggle vote state
        queryClient.setQueryData(["vote-count", placeId], (prev: number) => (hasVoted ? prev - 1 : prev + 1));

         // Conditionally show a toast based on whether adding or removing a vote
      if (hasVoted) {
        toast('Your vote has been removed!');
      } else {
        toast.success('Your vote has been added!');
      }


  
        // Return the context to potentially roll back in case of an error
        return { previousHasVoted, previousVoteCount };
      },
      onError: (error, variables, context) => {
        // Rollback the optimistic update if the mutation fails
        queryClient.setQueryData(["hasVoted", place.id], context?.previousHasVoted);
        queryClient.setQueryData(["vote-count", place.id], context?.previousVoteCount);
      },
      onSettled: () => {
        // Invalidate queries to refetch the data from the server after mutation settles
        queryClient.invalidateQueries({ queryKey: ["hasVoted", place.id] });
        queryClient.invalidateQueries({ queryKey: ["vote-count", place.id] });
      },
    }
  );
  
  
  const handleVote = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (clerkId) {
        addOrRemoveVote({ placeId: place.id, userId: clerkId}); // Pass an object to the mutation

    } else {
      console.error("clerkId is undefined");
    }
  };
  

  return (
    <div
      key={place.id}
      className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
    >
      {/* User Info */}
      <div className="p-4 flex items-center gap-3 border-b">
        <Avatar className="h-10 w-10">
          <Image
            src={place.user.profileUrl || "https://github.com/shadcn.png"}
            alt={  "User"}
            width={40}
            height={40}
          />
        </Avatar>
        <div>
          <p className="font-semibold">{place.user.name}</p>
          <p className="text-sm text-muted-foreground">
            {place.user.occupation}
          </p>
        </div>
      </div>

      {/* Image */}
      <div className="relative h-[400px]">
        <Image
          src={place?.image?.[0] || ""}
          alt={place?.name || "Place"}
          fill
          className="object-cover"
        />
        <Badge className="absolute top-4 right-4">{place.category}</Badge>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{place.name}</h3>
        <p className="text-muted-foreground mb-4">{place.description}</p>

        {/* Interactions */}
        <div className="flex items-center gap-4 text-muted-foreground mb-4">
          <Button variant="ghost" size="sm" className="gap-2" onClick={handleVote}>
            <Heart
              className={`h-4 w-4 ${
                hasVoted ? "fill-primary text-primary" : ""
              }`}
            />
            <span>{voteCount}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <MessageSquare className="w-4 h-4" />
            <span>{place.comments.length}</span>
          </Button>
          <Button variant="ghost" size="sm" className="ml-auto">
            <Bookmark className="w-4 h-4" />
          </Button>
        </div>

        {/* Comments */}
        <div className="space-y-4">
          {place.comments &&
            place.comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <Image
                    src={
                      comment.user.profileUrl || "https://github.com/shadcn.png"
                    }
                    alt={comment.user.name || "User"}
                    width={32}
                    height={32}
                  />
                </Avatar>
                <div className="flex-1">
                  <div className="bg-accent rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-sm">
                        {comment.user.name}
                      </p>
                      
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => mutateDelete(comment.id)}
                        aria-label="Delete comment"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                  <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                    <button className="hover:text-foreground">Like</button>
                    <button className="hover:text-foreground">Reply</button>
                    <span>
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}

          {/* Add Comment */}
          <div className="flex gap-3 items-center">
            <Avatar className="h-8 w-8">
              <Image
                src={profileUrl || "https://github.com/shadcn.png"}
                alt="Your avatar"
                width={32}
                height={32}
              />
            </Avatar>
            <div className="flex-1 flex gap-2">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-0 h-9 py-2 resize-none"
              />
              <Button
                size="icon"
                onClick={() => handleComment(place.id)}
                disabled={!newComment.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
