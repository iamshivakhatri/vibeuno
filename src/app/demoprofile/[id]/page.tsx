import { currentUser } from '@clerk/nextjs/server';
import Image from "next/image";
import { MapPin, Users, Grid, Bookmark, Settings, Edit, Calendar, Link as LinkIcon } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { notFound } from 'next/navigation';
import { getProfileData, getUserById } from '@/actions/user';
import ProfileHeader from './components/ProfileHeader';
import {PlaceTabs} from './components/PlaceTabs';



type Place = {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
  numVotes: number;
  comments: any[];
  createdAt: string;
};

type User = {
  id: string;
  name: string;
  profileUrl: string;
  coverPhotoUrl: string;
  occupation: string;
  location: string;
  interests: string;
};

export default async function ProfilePage({ params }: { params: { id: string } }){
  // const { userId } = useParams();
  const clerkUser = await currentUser();

  console.log('this is the profile id', params.id);

  // Fetch profile user data
  const profileUser = await getUserById(params.id);

  console.log('this is the profile user', profileUser);

  // Handle other non-200 responses
  if (profileUser.status !== 200 && profileUser.status !== 403) {
    notFound();
  }



  // Fetch profile data for valid users
  const userId = profileUser.user?.id;
  const user = await getProfileData(userId!);


  // Convert null values to undefined for optional properties
  user.location = user.location ?? null;
  user.university = user.university ?? null;
  user.occupation = user.occupation ?? null;
  

  // Determine if the current user is viewing their own profile
  const isCurrentUser = clerkUser?.id === user.clerkId;



  // const [activeTab, setActiveTab] = useState("places");

  // Mock user data based on your schema
  // const user: User = {
  //   id: userId as string,
  //   name: "Sarah Chen",
  //   profileUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
  //   coverPhotoUrl: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
  //   occupation: "Travel Photographer",
  //   location: "New York City",
  //   interests: "Photography, Travel, Art, Food"
  // };

  // Mock places data
  const userPlaces: Place[] = [
    {
      id: "1",
      name: "Central Park Sunset",
      imageUrl: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
      category: "Parks",
      numVotes: 1234,
      comments: [],
      createdAt: "2024-03-20T10:00:00Z"
    },
    {
      id: "2",
      name: "Brooklyn Bridge",
      imageUrl: "https://images.unsplash.com/photo-1522083165195-3424ed129620",
      category: "Architecture",
      numVotes: 892,
      comments: [],
      createdAt: "2024-03-19T15:30:00Z"
    }
  ];

  const stats = {
    places: 156,
    followers: 12453,
    following: 892
  };

  return (
 
    <div className="min-h-screen bg-background">
    <ProfileHeader user={user} isCurrentUser={isCurrentUser} />
    <div className="max-w-7xl mx-auto px-4">
      <PlaceTabs userId={user.id} />
    </div>
  </div>
  );
}