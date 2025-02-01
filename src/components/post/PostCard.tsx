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
  MoreVertical,
  Trash2,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { hasUserVotedForPlace, getPlaceVoteCount } from "@/actions/user";
import { Badge } from "@/components/ui/badge";
import { createComment, getCommentsByPlaceId } from "@/actions/place";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteComment, deletePlace } from "@/actions/place";
import { useMutationData, useMutationDataState } from "@/hooks/useMutationData";
import {
  voteForPlace,
  toggleCommentLike,
  bookMarkPlace,
} from "@/actions/place";
import { toast } from "sonner";
import { CommentSection } from "./CommentSection";
import { ImageCarousel } from "./ImageCarousel";
import { JsonValue } from "@prisma/client/runtime/library";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { isPlaceInWishlist } from "@/actions/place";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Place = {
  id: string;
  name: string | null;
  caption: string | null;
  description: string | null;
  image: string[] | null;
  city: string ; 
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
  console.log("this is the user", userId, place.user.id);
  const isCurrentUser = userId === place.user.id;
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [newComment, setNewComment] = useState("");
  const queryClient = useQueryClient();

  const router = useRouter();

  const {data: hasUserBookMarked} = useQuery({
    queryKey: ["wishlistStatus", place.id, userId],
    queryFn: async () => {
      if (!place.id || !userId) return false;
      return await isPlaceInWishlist(place.id, userId);
    },
    enabled: !!place.id && !!userId,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const { data: allComments } = useQuery<Comment[]>({
    queryKey: ["all-comments", place.id, userId],
    queryFn: () => getCommentsByPlaceId(place.id, userId),
    enabled: !!place.id && !!userId,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // Optimize mutations with better error handling
  const { mutate: handleLike } = useMutationData(
    ["toggle-like", place.id], // Changed key to be more specific
    (commentId: string) => toggleCommentLike({ userId, commentId }),
    ["all-comments", place.id, userId]
  );

  const { mutate: addComment, isPending: isAddingCommentPending } =
    useMutationData(
      ["add-comment", place.id],
      (newComment: {
        content: string;
        userId: string;
        placeId: string;
        parentId?: string;
      }) => createComment(newComment),
      ["all-comments", place.id, userId],
      () => setNewComment("")
    );

  const { mutate: mutateDelete, isPending: isDeletingCommentPending } =
    useMutationData(
      ["delete-comment", place.id],
      (commentId: string) => deleteComment(commentId),
      ["all-comments", place.id, userId],
    );

  const handleComment = (
    placeId: string,
    content: string,
    commentId?: string
  ) => {
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
    } else {
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
    queryKey: ["vote-count", place.id],
    queryFn: () => getPlaceVoteCount(place.id),
  });

  const { mutate: handleBookmark } = useMutation({
    mutationFn: (placeId: string) => bookMarkPlace({ placeId, userId }),
    onMutate: async (placeId) => {
      await queryClient.cancelQueries({
        queryKey: ["wishlistStatus", placeId, userId],
      });

      const previousStatus = queryClient.getQueryData([
        "wishlistStatus",
        placeId,
        userId,
      ]);

      // Optimistically update
      queryClient.setQueryData(
        ["wishlistStatus", placeId, userId],
        !previousStatus
      );

      return { previousStatus };
    },
    onError: (err, placeId, context) => {
      queryClient.setQueryData(
        ["wishlistStatus", placeId, userId],
        context?.previousStatus
      );
      toast.error("Failed to update bookmark status");
    },
    onSuccess: () => {
      toast.success(
        hasUserBookMarked
          ? "Added to bookmarks"
          : "Removed from bookmarks"
      );
    },
  });

  // Debounced bookmark handler to prevent rapid clicking
  const handleBookmarkClick = () => {
    handleBookmark(place.id);
  };

  const { mutate: addOrRemoveVote } = useMutation({
    mutationKey: ["handle-vote"],
    mutationFn: ({ placeId, userId }: { placeId: string; userId: string }) =>
      voteForPlace(placeId, userId),
    onMutate: async ({ placeId, userId }) => {
      // Capture the current state before mutation occurs
      const previousHasVoted = queryClient.getQueryData(["hasVoted", placeId]);
      const previousVoteCount = queryClient.getQueryData([
        "vote-count",
        placeId,
      ]);

      // Optimistically update the state
      queryClient.setQueryData(["hasVoted", placeId], !hasVoted); // Toggle vote state
      queryClient.setQueryData(["vote-count", placeId], (prev: number) =>
        hasVoted ? prev - 1 : prev + 1
      );

      // Conditionally show a toast based on whether adding or removing a vote
      if (hasVoted) {
        toast("Your vote has been removed!");
      } else {
        toast.success("Your vote has been added!");
      }

      // Return the context to potentially roll back in case of an error
      return { previousHasVoted, previousVoteCount };
    },
    onError: (error, variables, context) => {
      // Rollback the optimistic update if the mutation fails
      queryClient.setQueryData(
        ["hasVoted", place.id],
        context?.previousHasVoted
      );
      queryClient.setQueryData(
        ["vote-count", place.id],
        context?.previousVoteCount
      );
    },
    onSettled: () => {
      // Invalidate queries to refetch the data from the server after mutation settles
      queryClient.invalidateQueries({ queryKey: ["hasVoted", place.id] });
      queryClient.invalidateQueries({ queryKey: ["vote-count", place.id] });
    },
  });

  const handleVote = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (clerkId) {
      addOrRemoveVote({ placeId: place.id, userId: clerkId }); // Pass an object to the mutation
    } else {
      console.error("clerkId is undefined");
    }
  };

  const handleNavigate = (id: string) => {
    router.push(`/profile/${id}`);
  };

  const { mutate: handleDeletePost } = useMutation({
    mutationFn: (postId: string) => deletePlace(postId, userId),
    onSuccess: () => {
      toast.success("Post deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["all-posts"] });
    },
    onError: () => {
      toast.error("Failed to delete post");
    },
  });




  return (
    <div
      key={place.id}
      className="overflow-hidden  shadow-sm transition-shadow"
    >
      {/* User Info */}
      <div className="p-4 flex items-center gap-3 border-b">
      {/* Avatar with Navigation */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => handleNavigate(place?.user?.id)}
        role="button"
        aria-label={`Navigate to ${place?.user?.name || "User"}'s profile`}
      >
        <Avatar className="h-10 w-10">
          <Image
            src={place?.user?.profileUrl || "https://github.com/shadcn.png"}
            alt={place?.user?.name || "User"}
            width={40}
            height={40}
          />
        </Avatar>
      </div>

      {/* Name and Occupation with Navigation */}
      <div className="flex  mb-4">
        <div className="flex">

        <p
          className="font-semibold hover:cursor-pointer hover:underline mr-2"
          onClick={() => handleNavigate(place?.user?.id)}
          role="button"
          aria-label={`Navigate to ${place?.user?.name || "User"}'s profile`}
        >
          {place?.user?.name || "Unknown User"} 
        </p>
        <p 
          className="hover:underline hover:cursor-pointer"
          onClick={() => router.push(`/city/${place?.city}`)}
        >
          City | {place?.city?.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          ).join(' ')}
        </p>
        </div>

        {/* <p className="text-sm text-muted-foreground">
          {place?.user?.occupation ||""}
        </p> */}
      </div>

      {isCurrentUser && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="ml-auto">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => handleDeletePost(place.id)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Post
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>



      {/* Image Carousel */}
      <ImageCarousel
        images={place.image || []}
        category={place.category || ""}
      />

      {/* Content */}
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{place.name}</h3>
        <p className="text-muted-foreground mb-4">{place.description}</p>
        <p>{isCurrentUser}</p>

        {/* Interactions */}
        <div className="flex items-center gap-4 text-muted-foreground mb-4">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={handleVote}
          >
            <Heart
              className={`h-4 w-4 ${
                hasVoted ? "fill-primary text-primary" : ""
              }`}
            />
            <span>{voteCount}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <MessageSquare className="w-4 h-4" />
            <span>{allComments?.length || 0}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto"
            onClick={handleBookmarkClick}
          >
            {/* <Bookmark className="w-4 h-4" /> */}
            <Bookmark
              className={`h-4 w-4 ${
                hasUserBookMarked ? "fill-primary text-primary" : ""
              }`}
            />


          </Button>
        </div>

        <CommentSection
          place={{ id: place.id, comments: allComments || [] }}
          profileUrl={profileUrl}
          handleComment={handleComment}
          mutateDelete={mutateDelete}
          handleLike={handleLike}
          isCurrentUser={isCurrentUser}
        />
      </div>
    </div>
  );
};

export default PostCard;
