import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from "@/lib/db";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const placeId = formData.get('placeId') as string;
    const userId = formData.get('userId') as string;

    // Fetch place by placeId to get the current image list and city name
    const place = await prisma.place.findUnique({
      where: { id: placeId },
      select: {
        id: true,
        image: true, // To update the image array
        city: true,  // Assuming the city field is available
      },
    });

    if (!place) {
      throw new Error("Place not found for the provided placeId");
    }

    const currentImages: string[] = Array.isArray(place.image) ? place.image as string[] : []; // Ensure image is an array of strings

    const uploadPromises = files.map(async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer());

      // Optimize image while maintaining quality
      const optimizedBuffer = await sharp(buffer)
        .resize(2000, 2000, { // Max dimensions
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({ 
          quality: 85,
          progressive: true,
          mozjpeg: true
        })
        .toBuffer();

      // Use city name instead of placeId for S3 upload path
      const cityName = place.city.toLowerCase(); // Handle spaces in city name
      const key = `places/${cityName}/${uuidv4()}-${file.name}`;

      // Upload to S3
      await s3Client.send(new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: optimizedBuffer,
        ContentType: file.type,
      }));

      return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    });

    // Upload images and get their URLs
    const uploadedFiles = await Promise.all(uploadPromises);


    // Update the place's image field by appending the new image URLs to the existing list
    const updatedPlace = await prisma.place.update({
      where: { id: placeId },
      data: {
        image: [ ...currentImages, ...uploadedFiles],
        imageUrl: uploadedFiles[0], // Assuming the first image is the cover image
      },
    });

    console.log('Updated place:', updatedPlace);

    return NextResponse.json({ 
      success: true, 
      files: uploadedFiles,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Upload failed' },
      { status: 500 }
    );
  }
}
