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
import { voteForPlace, toggleCommentLike, bookMarkPlace } from "@/actions/place";
import { toast } from "sonner"
import { CommentSection } from "./CommentSection"
import { ImageCarousel } from "./ImageCarousel"
import { JsonValue } from "@prisma/client/runtime/library";


type Place = {
  id: string;
  name: string | null;
  caption: string | null;
  description: string | null;
  image: string[] | null;
  imageUrl: string | null;
  category: string | null;
  numVotes: number;
  comments: Comment[];
  user: User;
  createdAt: Date;
};

type User = {
  id: string;
  name: string | null;
  profileUrl: string | null;
  occupation: string | null;
};

type Comment = {
  id: string;
  content: string;
  user: {
    id: string;
    name: string;
    profileUrl: string | null;
    occupation: string | null;
  };
  userId: string;
  placeId: string;
  createdAt: Date;
  editedAt: Date | null;
  isEdited: boolean;
  likes: number;
  reported: boolean;
  parentId: string | null;
  visible: boolean;
};
type PostCardProps = {
  place: Place;
  profileUrl: string | null | undefined;
  userId: string;
  clerkId: string | undefined;
};



// type PostCardProps = {
//   place: Place;

//   profileUrl: string | null | undefined;

//   userId: string;

//   clerkId: string | undefined;
// };

const PostCard = ({ place, profileUrl, userId, clerkId }: PostCardProps) => {


  const [selectedCategory, setSelectedCategory] = useState("All");
  const [newComment, setNewComment] = useState("");
  const queryClient = useQueryClient();


  const { mutate: handleLike } = useMutationData(
    ['add-comment'],
    (commentId) => toggleCommentLike({ userId, commentId }), // Use userId from this scope
    'placesFromCity',
  );

//   const handleLike = (commentId: string) => {
//   }


  const {mutate:addComment , isPending: isAddingCommentPending} = useMutationData(
    ['add-comment'],
    (newComment: {
        content: string;
        userId: string;
        placeId: string;
        parentId?: string;
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


const handleComment = (placeId: string, content: string, commentId?: string) => {
    // if (!newComment.trim()) return;
    // const content = newComment.trim();

    if (commentId) {
        const parentId = commentId;
        addComment({
            content,
            userId,
            placeId,
            parentId,
          });
    
    }else{
        addComment({
            content,
            userId,
            placeId,
          });
    }
    
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

  const {mutate:handleBookmark} = useMutationData(
    ['handle-bookmark'],
    (placeId: string) => bookMarkPlace({placeId, userId}),
  )


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
    <div key={place.id} className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
    {/* User Info */}
    <div className="p-4 flex items-center gap-3 border-b">
      <Avatar className="h-10 w-10">
        <Image
          src={place.user.profileUrl || "https://github.com/shadcn.png"}
          alt={place.user.name || "User"}
          width={40}
          height={40}
        />
      </Avatar>
      <div>
        <p className="font-semibold">{place.user.name}</p>
        <p className="text-sm text-muted-foreground">{place.user.occupation}</p>
      </div>
    </div>

    {/* Image Carousel */}
    <ImageCarousel images={place.image || []} category={place.category || ""} />

    {/* Content */}
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-2">{place.name}</h3>
      <p className="text-muted-foreground mb-4">{place.description}</p>

      {/* Interactions */}
      <div className="flex items-center gap-4 text-muted-foreground mb-4">
        <Button variant="ghost" size="sm" className="gap-2" onClick={handleVote}>
          <Heart className={`h-4 w-4 ${hasVoted ? "fill-primary text-primary" : ""}`} />
          <span>{voteCount}</span>
        </Button>
        <Button variant="ghost" size="sm" className="gap-2">
          <MessageSquare className="w-4 h-4" />
          <span>{place.comments.length}</span>
        </Button>
        <Button variant="ghost" size="sm" className="ml-auto" onClick={() => (handleBookmark(place.id))}>
          <Bookmark className="w-4 h-4" />
        </Button>
      </div>

      <CommentSection
        place={{ id: place.id, comments: place.comments }}
        profileUrl={profileUrl}
        handleComment={handleComment}
        mutateDelete={mutateDelete}
        handleLike={handleLike}
      />
    </div>
  </div>

     
     

      
  );
};

export default PostCard;
