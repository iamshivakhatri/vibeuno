"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

import { Camera, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";

interface PhotoUploadProps {
  placeId: string;
  onUploadComplete: (urls: string[]) => void;
  user: any;
  category: string;
  name: string;
}

export function PhotoUpload({
  placeId,
  onUploadComplete,
  user,
  category,
  name
}: PhotoUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);


  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Create preview URLs
    const newPreviews = acceptedFiles.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    // disabled: !category || !placeId,
  });

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };



 
  
  const uploadFiles = async () => {
    if (!placeId) {
      toast({ title: "Please select a place before uploading photos", variant: "destructive" });
      return;
    }
  
    if (files.length === 0) {
      toast({ title: "No photos selected for upload", variant: "destructive" });
      return;
    }
  
    setUploading(true);
    setProgress(0);
  
    try {
      // Step 1: Request presigned URLs from your API
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          placeId,
          userId: user.id,
          category,
          name,
          fileNames: files.map((file) => file.name),
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get presigned URLs");
      }
  
      const { presignedData } = await response.json();

  
      // Step 2: Upload files directly to S3
      const uploadPromises = files.map(async (file, index) => {
        const optimizedFile = await optimizeImage(file);
        const uploadResponse = await fetch(presignedData[index].presignedUrl, {
          method: "PUT",
          body: optimizedFile,
          headers: { "Content-Type": file.type },
        });
  
        if (!uploadResponse.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }
  
        setProgress((prev) => prev + (100 / files.length)); // Update progress
        return presignedData[index].url; // Return the uploaded file URL
      });
  
      const uploadedUrls = await Promise.all(uploadPromises);
  
      // Success handling
      toast({ title: "Photos uploaded successfully" });
      onUploadComplete(uploadedUrls);
  
      setFiles([]);
      setPreviews([]);


    } catch (error) {
      console.error("Upload error:", error);
      toast({ title: "Failed to upload photos" });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };
  

  async function optimizeImage(file: File): Promise<Blob> {
    // You'll need to install a client-side image processing library like browser-image-compression
    const imageCompression = (await import('browser-image-compression')).default;
    
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 2000,
      useWebWorker: true,
    };
  
    try {
      return await imageCompression(file, options);
    } catch (error) {
      console.error('Image compression failed:', error);
      return file; // Return original file if compression fails
    }
    }



  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200
          ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          }
        `}
      >
        <input {...getInputProps()} />
        <Camera className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground">
          {isDragActive
            ? "Drop your photos here..."
            : "Drag & drop photos here, or click to select"}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Maximum file size: 10MB
        </p>
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <div key={preview} className="relative group aspect-square">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                onClick={() => removeFile(index)}
                className="absolute top-2 right-2 p-1 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-4">
          {uploading && <Progress value={progress} className="w-full" />}
          <Button onClick={uploadFiles} disabled={uploading} className="w-full">
            <Upload className="mr-2 h-4 w-4" />
            {uploading
              ? "Uploading..."
              : `Upload ${files.length} Photo${files.length === 1 ? "" : "s"}`}
          </Button>
        </div>
      )}
    </div>
  );
}
