"use client";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, MapPin, Award, Camera, Heart } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { uploadProfilePicture } from "@/actions/user";
import axios from "axios";

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
    profileUrl: string | null ;
    coverPhotoUrl: string | null;
  };
  isCurrentUser?: boolean;
};

export function ProfileHeader({ user, isCurrentUser }: ProfileHeaderProps) {
  const [copied, setCopied] = useState(false);
  const [uploading, setUploading] = useState(false);

  if (!user) {
    return null;
  }


  const handleCoverPhotoChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;


  
    setUploading(true);
    try {

      const formData = new FormData();
      formData.append('file', file);
      formData.append('id', user.id);

      const { data } = await axios.post('/api/aws-cover', 
        formData,        
        {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
     // Update the user's cover photo URL in the state
      if (data?.imageUrl) {
        toast({ title: "Cover photo updated!" });
        // setUser({ ...user, coverPhotoUrl: data.imageUrl });
      }
    } catch (error) {
      console.error("Error uploading cover photo:", error);
    } finally {
      setUploading(false);
    }
  };
  

  const handleProfilePictureChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // const imageUrl = await uploadProfilePicture(file, user.id);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('id', user.id);
  
      // Make a POST request to the API
      const { data } = await axios.post('/api/aws-profile', 
        formData,        
        {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (data.success) {
        toast({ title: "Profile picture updated!" });
      }

      // Update the profile URL on the page
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to update profile picture. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  // const handleShare = async () => {
  //   await navigator.clipboard.writeText(window.location.href);
  //   setCopied(true);
  //   toast({ title: "Profile link copied to clipboard!" });
  //   setTimeout(() => setCopied(false), 2000);
  // };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/share/${user.id}`;
    await navigator.clipboard.writeText(shareUrl);
    toast({ title: "Profile link copied to clipboard!" });
  };

  return (
    <div className="relative">
      {/* Hero Section with Curved Bottom */}
      {/* <div className="relative h-64 bg-gradient-to-r from-rose-400 to-purple-400">
        <div className="absolute bottom-0 w-full">
          <svg viewBox="0 0 1440 320" className="w-full">
            <path
              fill="currentColor"
              className="text-rose-50"
              d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </div> */}

<div className="relative h-64 bg-gradient-to-r from-rose-400 to-purple-400">
  <div className="absolute bottom-0 w-full">
    <svg
      viewBox="0 0 1440 320"
      className="w-full"
    >
      <path
        fill="currentColor"
        className="text-rose-50"
        d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
      ></path>
    </svg>
  </div>

  {/* Cover Photo Section */}
  <div className="absolute top-0 left-0 w-full h-full">
    <img
      src={user.coverPhotoUrl || "https://via.placeholder.com/1440x320/0000FF/808080?Text=Cover+Photo"} // Fallback image
      alt="Cover Photo"
      className="w-full h-full object-cover"
    />

    {/* Upload Button for Cover Photo */}
    {isCurrentUser && (
      <label
        htmlFor="coverPhoto"
        className="absolute top-2 right-2 bg-gradient-to-r from-rose-400 to-purple-400 cursor-pointer rounded-full p-2"
      >
        <Camera className="w-5 h-5 text-white" />
        <input
          type="file"
          id="coverPhoto"
          className="hidden"
          accept="image/*"
          onChange={handleCoverPhotoChange}
          disabled={uploading}
        />
      </label>
    )}
  </div>
</div>


      

      <div className="container">
        <div className="relative -mt-32 mb-8">
          <div className="p-6 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Avatar */}
              <div className="relative">
                <div className="w-40 h-40 rounded-full bg-gradient-to-r from-rose-400 to-purple-400 p-1">
                  <Avatar className="w-full h-full border-4 border-background">
                  <img
                    src={user.profileUrl ? user.profileUrl : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />

                  </Avatar>
                </div>
                {isCurrentUser && (
                  <label
                    htmlFor="profilePicture"
                    className="absolute -bottom -right-1 bg-gradient-to-r from-rose-400 to-purple-400 cursor-pointer rounded-full p-2 shadow-lg"
                  >
                    <Camera className="w-5 h-5 text-white" />
                    <input
                      type="file"
                      id="profilePicture"
                      className="hidden"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      disabled={uploading}
                    />
                  </label>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold">{user.name}</h1>
                    <p className="mt-2 text-muted-foreground">
                      Travel enthusiast | Photography lover | Adventure seeker
                    </p>
                  </div>
                  {isCurrentUser && (
                    <div className="flex">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleShare}
                        className="hidden md:flex items-center gap-2"
                      >
                        <Share2 className="h-4 w-4" />
                        {copied ? "Copied!" : "Share Profile"}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                  <div className="p-4 rounded-xl bg-white shadow-sm">
                    <div className="text-2xl font-bold text-rose-500">
                      {user.placesCount}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Places Visited
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white shadow-sm">
                    <div className="text-2xl font-bold text-purple-500">
                      {user.totalPoints}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Points Earned
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white shadow-sm">
                    <div className="text-2xl font-bold text-rose-500">
                      {user.votesCount}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Votes
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white shadow-sm">
                    <div className="text-2xl font-bold text-purple-500">
                      {new Date(user.createdAt).getFullYear()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Joined Year
                    </div>
                  </div>
                </div>

                {/* Achievements */}
                <div className="mt-8 pt-8 border-t">
                  <h3 className="text-lg font-semibold mb-4">
                    Recent Achievements
                  </h3>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    <Badge variant="secondary" className="py-2">
                      <MapPin className="w-3 h-3 mr-1" />
                      Explorer
                    </Badge>
                    <Badge variant="secondary" className="py-2">
                      <Camera className="w-3 h-3 mr-1" />
                      Photographer
                    </Badge>
                    <Badge variant="secondary" className="py-2">
                      <Heart className="w-3 h-3 mr-1" />
                      Rising Star
                    </Badge>
                    <Badge variant="secondary" className="py-2">
                      <Award className="w-3 h-3 mr-1" />
                      Early Adopter
                    </Badge>
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
