"use client";

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';


import { Camera, X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';

interface PhotoUploadProps {
  placeId: string;
  onUploadComplete: (urls: string[]) => void;
  user: any;
  category: string;

}

export function PhotoUpload({ placeId, onUploadComplete, user, category }: PhotoUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  


  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Create preview URLs
    const newPreviews = acceptedFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
    setFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    // disabled: !category || !placeId,



  });

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setPreviews(prev => prev.filter((_, i) => i !== index));
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {

    if (!placeId) {
      console.log('placeId:', placeId);
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
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));
      formData.append('placeId', placeId);
      formData.append('userId', user.id);
      formData.append('category', category);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      if (data.success) {
        toast({ title: "Photos uploaded successfully" });
        onUploadComplete(data.files.map((f: any) => f.url));
        // Clean up
        previews.forEach(preview => URL.revokeObjectURL(preview));
        setFiles([]);
        setPreviews([]);
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error) {
      toast({ title: "Failed to upload photos", variant: "destructive" });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
        `}
      >
        <input {...getInputProps()} />
        <Camera className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground">
          {isDragActive ? (
            'Drop your photos here...'
          ) : (
            'Drag & drop photos here, or click to select'
          )}
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
          {uploading && (
            <Progress value={progress} className="w-full" />
          )}
          <Button
            onClick={uploadFiles}
            disabled={uploading}
            className="w-full"
          >
            <Upload className="mr-2 h-4 w-4" />
            {uploading ? 'Uploading...' : `Upload ${files.length} Photo${files.length === 1 ? '' : 's'}`}
          </Button>
        </div>
      )}
    </div>
  );
}