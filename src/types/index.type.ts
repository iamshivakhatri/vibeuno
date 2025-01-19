import { JsonValue } from 'type-fest';

export type Place = {
    state: string; // State where the place is located
    name: string; // Name of the place
    id: string; // Unique ID for the place
    description: string | null; // Description of the place, may be null
    city: string; // City where the place is located
    category: string; // Category of the place (e.g., "entertainment")
    imageUrl?: string | null; // URL of an image associated with the place, may be null
  _count: {
          votes: number; // Number of votes for the place
      };
  };


  export interface User {
    id: string;
    name: string;
    username: string;
    avatar: string;
    bio: string;
    followers: number;
    following: number;
  }
  
//   export interface Comment {
//     id: string;
//     content: string;
//     author: User;
//     createdAt: string;
//     likes: number;
//   }

  export interface Comment {
        id: string;
        content: string;
        createdAt: Date;
        user: {
            id: string;
            name: string | null;
            profileUrl: string | null;
        };
  }

  



  export type Post = {
    id: string;
    name: string | null;
    description: string | null;
    image: JsonValue;
    city: string; // Adjust this based on the actual type (e.g., string or a related object type)
    category: string | null; // Adjust this based on the actual type (e.g., string or an enum)
    caption: string | null; // Ensure it exists in the schema
    numVotes: number| null;
    user: {
      id: string;
      name: string | null;
      profileUrl: string | null;
    };
    comments:Comment[];
    createdAt: Date;
  };
  


  
  export interface City {
    id: string;
    name: string;
    country: string;
    coverImage: string;
    members: number;
    description: string;
    posts?: Post[];
  }