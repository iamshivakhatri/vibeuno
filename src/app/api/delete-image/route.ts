// app/api/delete-image/route.ts
import { NextResponse } from 'next/server';
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { prisma } from "@/lib/db";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

function getS3KeyFromUrl(url: string): string {
  const urlObj = new URL(url);
  return urlObj.pathname.substring(1);
}

async function deleteFromS3(imageUrl: string) {
  try {
    const key = getS3KeyFromUrl(imageUrl);
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: key,
      })
    );
  } catch (error) {
    console.error('Failed to delete from S3:', error);
    throw error;
  }
}

export async function DELETE(request: Request) {
  try {
    const { placeId, imageIndex } = await request.json();

    if (!placeId || typeof imageIndex !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Place ID and image index are required' },
        { status: 400 }
      );
    }

    const place = await prisma.place.findUnique({
      where: { id: placeId },
      select: { image: true }
    });

    if (!place) {
      return NextResponse.json(
        { success: false, error: 'Place not found' },
        { status: 404 }
      );
    }

    const images = place.image as string[];
    if (!Array.isArray(images) || !images.length) {
      return NextResponse.json(
        { success: false, error: 'No images found' },
        { status: 404 }
      );
    }

    const imageToDelete = images[imageIndex];
    if (!imageToDelete) {
      return NextResponse.json(
        { success: false, error: 'Image not found at specified index' },
        { status: 404 }
      );
    }

    // Delete from S3
    await deleteFromS3(imageToDelete);

    // Update database
    const updatedImages = images.filter((_, index) => index !== imageIndex);
    await prisma.place.update({
      where: { id: placeId },
      data: { 
        image: updatedImages,
        ...(imageIndex === 0 && updatedImages.length > 0 ? 
          { imageUrl: updatedImages[0] } : 
          {})
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete image error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}