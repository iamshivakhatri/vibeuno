"use client"
import Image from 'next/image';
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Settings, MapPin, Calendar,   Briefcase,} from 'lucide-react';
import { Badge } from "@/components/ui/badge";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserInfo } from "@/actions/user"; // Import server-side action
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import axios from "axios";

import {
    Share2,
    Award,
    Camera,
    Heart,
    School,
    PlusCircle,
    Edit2,
  } from "lucide-react";

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
      profileUrl: string | null;
      coverPhotoUrl: string | null;
      location?: string | null;
      university?: string| null;
      occupation?: string| null;
      interests?: string| null;
    };
    isCurrentUser?: boolean;
  };
  

export default function ProfileHeader({ user, isCurrentUser }: ProfileHeaderProps) {
    const [copied, setCopied] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [key, setKey] = useState("");
    const [value, setValue] = useState("");
    const queryClient = useQueryClient();
    const [localUser, setLocalUser] = useState(user); // Add local state to handle immediate updates
  
    const [editMode, setEditMode] = useState<{
      location: boolean;
      university: boolean;
      occupation: boolean;
      interests: boolean;
    }>({
      location: false,
      university: false,
      occupation: false,
      interests: false,
    });

    const handleCoverPhotoChange = async (
        event: React.ChangeEvent<HTMLInputElement>
      ) => {
        const file = event.target.files?.[0];
        if (!file) return;
    
        setUploading(true);
        try {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("id", user.id);
    
          const { data } = await axios.post("/api/aws-cover", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
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
          formData.append("file", file);
          formData.append("id", user.id);
    
          // Make a POST request to the API
          const { data } = await axios.post("/api/aws-profile", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
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
    
    
    
      const handleShare = async () => {
        const shareUrl = `${window.location.origin}/profile/${user.id}`;
        await navigator.clipboard.writeText(shareUrl);
        toast({ title: "Profile link copied to clipboard!" });
      };
    
      const toggleEdit = (field: keyof typeof editMode) => {
        setEditMode(prev => ({
          ...prev,
          [field]: !prev[field]
        }));
      };
  return (
    <div className="relative" >
        {/* Cover Photo */}
        <div className="relative h-[225px] sm:h-[250px] md:h-[300px] w-full">
            <Image
                src={user.coverPhotoUrl || "https://via.placeholder.com/1440x320/0000FF/808080?Text=Cover+Photo"}
                alt="Cover"
                fill
                className="md:object-cover"
                priority
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
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>


      {/* Profile Info */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative -mt-24 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Profile Picture */}

            <div className="relative">
            <Avatar className="h-32 w-32 border-4 border-background">
              <Image
                src={user.profileUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
                alt={user.name}
                width={128}
                height={128}
                className="object-cover"
              />
            </Avatar>

            {isCurrentUser && (
                  <div className="flex mt-2 mb-4 justify-center gap-x-6">
                    <div className="">
                      <label
                        htmlFor="profilePicture"
                        className="absolute -bottom-0 -left-0 bg-gradient-to-r from-rose-400 to-purple-400 cursor-pointer rounded-full p-2 shadow-lg"
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
                    </div>
                  
                  </div>
                )}

            </div>

            {/* User Info */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                <div>
                  <h1 className="text-3xl font-bold">{user.name}</h1>
                  <p className="text-muted-foreground">Software Engineer</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  {isCurrentUser && (
                    <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleShare}
        
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                  )}
                  
                  <Button size="sm">
                    Follow
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-6 mb-2">
                <div className="text-center">
                  <p className="text-xl font-bold">{user.placesCount}</p>
                  <p className="text-sm text-muted-foreground">Places</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold">{user.totalPoints}</p>
                  <p className="text-sm text-muted-foreground">Points</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold"> {user.votesCount}</p>
                  <p className="text-sm text-muted-foreground">Total Votes</p>
                </div>
              </div>

              {/* Bio & Info */}
              <div className="space-y-2 flex flex-col gap-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{user.location}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span> {new Date(user.createdAt).getFullYear()}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">

                <Briefcase className="w-4 h-4 text-muted-foreground" />
                <span>Work at {user.occupation}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(user.interests ?? "").split(", ").map((interest: string) => (
                    <Badge key={interest} variant="secondary">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>


            </div>
          </div>
        </div>
      
    </div>
    </div>
  );
}
