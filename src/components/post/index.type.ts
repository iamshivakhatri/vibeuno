import { JsonValue } from "@prisma/client/runtime/library";

export type Place = {
    id: string;
    name: string | null;
    caption?: string | null;
    description?: string | null;
    image: JsonValue
    imageUrl?: string | null;
    category?: string | null;
    numVotes: number | 0;
    comments: Comment[];
    user: User;
    createdAt: string;
  };
  
export type User = {
    id: string;
    name: string;
    profileUrl?: string | undefined
    occupation?: string;
  };
  
export type Comment = {
    id: string
    content: string
    user: {
      id: string
      name: string | null
      profileUrl: string | null
      occupation?: string | null
    }
    userId: string
    placeId: string
    createdAt: string
    editedAt?: string
    isEdited: boolean
    likes?: {
      userId: string
      id: string
      createdAt: string
      commentId: string
    }[]
    reported: boolean
    parentId?: string | null
    visible: boolean
};