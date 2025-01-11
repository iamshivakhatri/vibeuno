// app/api/delete-place/route.ts
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
    const { placeId } = await request.json();

    if (!placeId) {
      return NextResponse.json(
        { success: false, error: 'Place ID is required' },
        { status: 400 }
      );
    }

    // First, get the place and its images
    const place = await prisma.place.findUnique({
      where: { id: placeId },
      select: { image: true },
    });

    if (!place) {
      return NextResponse.json(
        { success: false, error: 'Place not found' },
        { status: 404 }
      );
    }

    // Delete images from S3
    const images = place.image as string[];
    if (Array.isArray(images) && images.length > 0) {
      const deletePromises = images.map((imageUrl) => deleteFromS3(imageUrl));
      await Promise.all(deletePromises);
    }

    // Delete related records from database
    await prisma.vote.deleteMany({
      where: { placeId },
    });

    await prisma.wishlistItem.deleteMany({
      where: { placeId },
    });

    await prisma.place.delete({
      where: { id: placeId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete place error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete place' },
      { status: 500 }
    );
  }
}