'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage  } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

import {updatePlaceDetails} from "@/actions/place"


import { Card } from '@/components/ui/card';

import { deletePlace, deleteImage, updateDescription } from '@/actions/place'
import { toast } from "sonner";
import {MoreVertical,  Trash2, Upload, X,  Camera, Heart, MapPin, MoreHorizontal, Share2, Grid, ChevronLeft, GalleryHorizontal, ChevronRight, Bookmark} from 'lucide-react'; // Import icons
import { PhotoUpload } from '../explore/photo-upload';
import { PhotoUpdate } from './photo-update';
import { set } from 'date-fns';
import { Input } from '@/components/ui/input';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookMarkPlace, isPlaceInWishlist } from "@/actions/place";
import { log } from 'console';



interface PlaceDetailProps {
  place: {
    id: string;
    name: string | null;
    description: string | null;
    image: string[] | null;
    city: string;
    state: string;
    
  };
  visitors: Array<{
    id: string;
    name: string;
    image?: string;
    profileUrl: string;
  }>;
  userId: string;
  isCurrentUser: boolean;
  loggedinUserId: string;
}


export function PlaceDetail({ 
  place, 
  visitors, 
  userId, 
  isCurrentUser, 
  loggedinUserId
}: PlaceDetailProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [description, setDescription] = useState(place?.description || '');
  const [deletingImageIndex, setDeletingImageIndex] = useState<number | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isEditing, setIsEditing] = useState(false);
  const [optimisticPlace, setOptimisticPlace] = useState(place);
  const [editedName, setEditedName] = useState(place?.name || '');

  const queryClient = useQueryClient();
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

 


    const {data: hasUserBookMarked} = useQuery({
      queryKey: ["wishlistStatus", place.id, loggedinUserId],
      queryFn: async () => {
        if (!place.id || !userId) return false;
        return await isPlaceInWishlist(place.id, loggedinUserId);
      },
      enabled: !!place.id && !!loggedinUserId,
      staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    });

    console.log('hasUserBookMarked:', hasUserBookMarked)

      const { mutate: handleBookmark } = useMutation({
        mutationFn: (placeId: string) => bookMarkPlace({ placeId, userId:loggedinUserId }),
        onMutate: async (placeId) => {
          await queryClient.cancelQueries({
            queryKey: ["wishlistStatus", placeId, loggedinUserId],
          });
    
          const previousStatus = queryClient.getQueryData([
            "wishlistStatus",
            placeId,
            loggedinUserId,
          ]);
    
          // Optimistically update
          queryClient.setQueryData(
            ["wishlistStatus", placeId, loggedinUserId],
            !previousStatus
          );
    
          return { previousStatus };
        },
        onError: (err, placeId, context) => {
          queryClient.setQueryData(
            ["wishlistStatus", placeId, loggedinUserId],
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

  const handleDeletePlace = async () => {
    try {
      const result = await deletePlace(place.id, userId)
      if (result.success) {
        window.location.href = `/profile/${userId}`
      } else {
        // Handle error, maybe show a toast notification
        console.error('Failed to delete place')
        toast("Failed to delete place");
      }
    } catch (error) {
      toast( "Failed to delete place",
              );
      console.error('Failed to delete place:', error)
    }
  }

  const handleDeleteImage = async (imageIndex: number) => {
    try {
      console.log('Deleting image:', imageIndex)
      const result = await deleteImage(place.id, imageIndex)

      if (result.success) {
        window.location.reload()
      } else {
        // Handle error
        console.error('Failed to delete image')
        toast(
      "Failed to delete image",
        );
      }
    } catch (error) {
      console.error('Failed to delete image:', error)
      toast( "Failed to delete image",
      );
    }
  }


  const handleSaveDescription = async () => {
    try {
      const result = await updateDescription(place.id, description)
      if (result.success) {
        setIsDescriptionModalOpen(false)
        window.location.reload()
      } else {
        // Handle error
        console.error('Failed to update description')
      }
    } catch (error) {
      console.error('Failed to update description:', error)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    try {
      const formData = new FormData();
      formData.append('placeId', place.id);
      formData.append('userId', userId);

      Array.from(files).forEach((file) => {
        formData.append('files', file);
      });
      
      const response = await fetch('/api/update-place', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        window.location.reload();
      } else {
        console.error('Failed to upload images');
      }
    } catch (error) {
      console.error('Failed to upload images:', error);
    }
  };

  const handleUpdateDetails = async () => {
    if (!editedName.trim()) {
      toast( "Place name cannot be empty",
     );
      return;
    }

    // Optimistic update
    setOptimisticPlace({
      ...optimisticPlace,
      name: editedName,
    });
    setIsEditing(false);

    try {
      const result = await updatePlaceDetails(place.id, {
        name: editedName,
      });

      if (!result.success) {
        setOptimisticPlace(place);
        toast( "Failed to update place name",
        );
      }else{
        toast( "Place name updated",
        );
      }
    } catch (error) {
      setOptimisticPlace(place);
      toast( "Failed to update place name",
       );
    }
  };

  const handleNextImage = () => {
    if (place.image) {
      setCurrentImageIndex((prev) => 
        prev === place.image!.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handlePreviousImage = () => {
    if (place.image) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? place.image!.length - 1 : prev - 1
      );
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white px-4 py-3">
        <div className="flex flex-col gap-2">
          {/* Place Name */}
          <div className="group relative">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 group-hover:bg-muted/50 transition-colors">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              {isEditing ? (
                <input
                  type="text"
                  placeholder="Enter place name"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="flex-1 bg-transparent border-none focus:outline-none text-lg font-medium"
                  onBlur={() => {
                    if (editedName.trim()) {
                      handleUpdateDetails();
                    }
                    setIsEditing(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && editedName.trim()) {
                      handleUpdateDetails();
                    }
                  }}
                  autoFocus
                />
              ) : (
                <div 
                  className="flex-1 cursor-text"
                  onClick={() => isCurrentUser && setIsEditing(true)}
                >
                  {optimisticPlace.name ? (
                    <>
                      <span className="text-lg font-medium">{optimisticPlace.name}</span>
                      {isCurrentUser && (
                        <span className="ml-2 text-sm text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                          (Click to edit)
                        </span>
                      )}
                    </>
                  ) : (
                    isCurrentUser ? (
                      <span className="text-blue-600 hover:text-blue-700">
                        + Add place name
                      </span>
                    ) : (
                      <span className="text-muted-foreground italic">
                        Unnamed place
                      </span>
                    )
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Location (Read-only) */}
          {(optimisticPlace.city || optimisticPlace.state) && (
            <div className="flex items-center gap-2 px-3 text-muted-foreground">
              <span className="text-sm">
                {optimisticPlace.city}, {optimisticPlace.state}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleBookmark(place.id)}
              className="ml-auto"
            >
              <Bookmark className={`h-5 w-5 ${
                hasUserBookMarked ? "fill-primary text-primary" : ""
              }`} />
            </Button>
          </div>
        </div>
      </div>

      {/* Place Info */}
      <div className="px-4 py-4 border-b">
        {/* <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">{place?.name}</h2>
            <p className="text-gray-600">{place?.city}, {place?.state}</p>
          </div>
          <Avatar className="h-16 w-16">
            <AvatarImage src={place?.image?.[0]} />
            <AvatarFallback>{place?.name?.[0]}</AvatarFallback>
          </Avatar>
        </div> */}
        <p className="text-sm text-gray-600 mb-4">
          {place?.description?.slice(0, 500)}
          {place?.description && place.description.length > 500 && '...'}
        </p>
        {isCurrentUser && (
          <Button
            variant="outline"
            onClick={() => setIsDescriptionModalOpen(true)}
            className="w-full"
          >
            {place?.description ? 'Edit Description' : 'Add Description'}
          </Button>
        )}
      </div>

      {/* Visitors */}
      <div className="px-4 py-4 border-b">
        <h3 className="font-semibold mb-2">Visitors</h3>
        <div className="flex -space-x-2 overflow-hidden">
          {visitors?.map((visitor) => (
            <Link 
            href={`/profile/${visitor.id}`} 
            key={visitor.id}
            >
            <Avatar key={visitor.id} className="inline-block h-8 w-8 rounded-full ring-2 ring-white">
              <AvatarImage src={visitor.profileUrl} />
              <AvatarFallback>{visitor.name[0]}</AvatarFallback>
            </Avatar>
            </Link>
          ))}
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex justify-center border-b">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setViewMode('grid')}
          className={`flex-1 ${viewMode === 'grid' ? 'border-b-2 border-black' : ''}`}
        >
          <Grid className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setViewMode('list')}
          className={`flex-1 ${viewMode === 'list' ? 'border-b-2 border-black' : ''}`}
        >
          <GalleryHorizontal className="h-5 w-5" />
        </Button>
      </div>

      {/* Image Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-3 gap-1">
          {place?.image?.map((image, index) => (
            <div 
              key={index}
              className="relative aspect-square cursor-pointer"
              onClick={() => setSelectedImage(image)}
            >
              <Image
                src={image}
                alt={`${place.name} ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4 p-4 md:w-6/12 md:m-auto">
          {place?.image?.map((image, index) => (
            <div 
              key={index}
              className="relative aspect-square cursor-pointer"
              onClick={() => setSelectedImage(image)}
            >
              <Image
                src={image}
                alt={`${place.name} ${index + 1}`}
                fill
                className="object-cover rounded-lg"
              />
              {isCurrentUser && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeletingImageIndex(index);
                  }}
                  className="absolute top-2 right-2 p-2 bg-black/70 rounded-full text-white"
                >
                <Trash2 className="h-4 w-4 text-red-500" />

                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Place</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">
            Are you sure you want to delete this place? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeletePlace}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deletingImageIndex !== null} onOpenChange={() => setDeletingImageIndex(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Image</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">
            Are you sure you want to delete this image? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingImageIndex(null)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                if (deletingImageIndex !== null) {
                  handleDeleteImage(deletingImageIndex);
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDescriptionModalOpen} onOpenChange={setIsDescriptionModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {place?.description ? 'Edit Description' : 'Add Description'}
            </DialogTitle>
          </DialogHeader>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe this place..."
            className="min-h-[200px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDescriptionModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveDescription}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Photos</DialogTitle>
          </DialogHeader>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            {/* <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="cursor-pointer"
            /> */}
            <PhotoUpdate
              placeId={place.id}
              userId={userId}
              onUploadComplete={()=> setIsUploadModalOpen(false)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadModalOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
          
      </DialogContent>
       
      </Dialog>

      <Dialog 
        open={!!selectedImage} 
        onOpenChange={() => setSelectedImage(null)}
      >
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0">
          <div className="fixed inset-0 bg-black/80" />
          <div className="relative w-full h-[90vh]">
            {selectedImage && (
              <>
                <Image
                  src={selectedImage}
                  alt="Full size image"
                  fill
                  className="object-contain"
                  priority
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePreviousImage();
                    setSelectedImage(place.image![currentImageIndex]);
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextImage();
                    setSelectedImage(place.image![currentImageIndex]);
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
                <div className="absolute top-4 right-4 flex gap-2">
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-black/50 hover:bg-black/70 text-white"
                    onClick={() => setSelectedImage(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

