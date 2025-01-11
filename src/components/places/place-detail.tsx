'use client';

import { use, useState, useEffect } from 'react';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, X, MoreVertical, Upload } from 'lucide-react'; // Import icons
import { deletePlace, deleteImage, updateDescription } from '@/actions/place'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

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
}

export function PlaceDetail({ place, visitors, userId, isCurrentUser }: PlaceDetailProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [description, setDescription] = useState(place.description || '');
  const [deletingImageIndex, setDeletingImageIndex] = useState<number | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  



  const handleDeletePlace = async () => {
    try {
      const result = await deletePlace(place.id, userId)
      if (result.success) {
        window.location.href = '/places'
      } else {
        // Handle error, maybe show a toast notification
        console.error('Failed to delete place')
      }
    } catch (error) {
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
      }
    } catch (error) {
      console.error('Failed to delete image:', error)
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header Section with Delete Place Button */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold mb-2">{place.name}</h1>
          <p className="text-xl text-gray-600">{place.city}, {place.state}</p>
        </div>
        {isCurrentUser && (
           <DropdownMenu>
           <DropdownMenuTrigger asChild>
             <Button variant="ghost" size="icon">
               <MoreVertical className="h-5 w-5" />
             </Button>
           </DropdownMenuTrigger>
           <DropdownMenuContent align="end">
             <DropdownMenuItem onClick={() => setIsUploadModalOpen(true)}>
               <Upload className="mr-2 h-4 w-4" />
               Add Photos
             </DropdownMenuItem>
             <DropdownMenuItem onClick={() => setIsDeleteModalOpen(true)} className="text-red-600">
               <Trash2 className="mr-2 h-4 w-4" />
               Delete Place
             </DropdownMenuItem>
           </DropdownMenuContent>
         </DropdownMenu>
        )}
       
      </div>

      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        {place.image?.map((image, index) => (
          <Card 
            key={index} 
            className="relative aspect-[3/2] overflow-hidden shadow-lg group cursor-pointer"
            onClick={() => setSelectedImage(image)}
          >
            <Image
              src={image}
              alt={`${place.name} ${index + 1}`}
              fill
              className="object-contain"
              priority={index === 0}
            />
            {isCurrentUser && (
              <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent modal from opening when delete button is clicked
                setDeletingImageIndex(index);
              }}
              className="absolute top-2 right-2 p-2 bg-black/70 rounded-full 
                text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={16} />
            </button>
              )}
            
          </Card>
        ))}
      </div>

      {/* Description Section */}
      <div className="bg-white rounded-xl p-8 shadow-sm mb-12">
        <h2 className="text-2xl font-semibold mb-6">About this place</h2>
        {place.description ? (
          <div className="relative">
            <p className="text-gray-700 leading-relaxed text-lg">
              {place.description}
            </p>
            {isCurrentUser && (
               <Button
               variant="outline"
               onClick={() => setIsDescriptionModalOpen(true)}
               className="mt-4"
             >
               Edit Description
             </Button>
            )}
           
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No description available yet</p>
            {isCurrentUser && (  
              <Button 
              onClick={() => setIsDescriptionModalOpen(true)}
              className="bg-black text-white px-6 py-3 rounded-full 
                hover:bg-gray-800 transition-colors duration-200"
            >
              Add Description
            </Button>
            )}
            
          </div>
        )}
      </div>

      {/* Visitors Section */}
      <div className="bg-gray-50 rounded-xl p-8">
        <h2 className="text-2xl font-semibold mb-6">Visitors</h2>
        <div className="flex flex-wrap gap-3">
          {visitors.map((visitor) => (
            <Link 
              href={`/profile/${visitor.id}`} 
              key={visitor.id}
              className="group"
            >
              <div className="flex items-center gap-3 bg-white rounded-full px-4 py-2
                shadow-sm hover:shadow-md transition-all duration-200">
                <Avatar className="h-10 w-10 border-2 border-white">
                  <AvatarImage src={visitor.profileUrl} />
                  <AvatarFallback>{visitor.name[0]}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  {visitor.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Delete Place Modal */}
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

      {/* Delete Image Modal */}
      <Dialog 
        open={deletingImageIndex !== null} 
        onOpenChange={() => setDeletingImageIndex(null)}
      >
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

      {/* Description Modal */}
      <Dialog open={isDescriptionModalOpen} onOpenChange={setIsDescriptionModalOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>
              {place.description ? 'Edit Description' : 'Add Description'}
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

      {/* Add Upload Modal */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Photos</DialogTitle>
          </DialogHeader>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="cursor-pointer"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadModalOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Full Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0">
          <div className="relative w-full h-[90vh]">
            {selectedImage && (
              <Image
                src={selectedImage}
                alt="Full size image"
                fill
                className="object-contain"
                priority
              />
            )}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-black/70 hover:bg-black/90 text-white"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 