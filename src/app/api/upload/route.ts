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
    
    console.log('Form data:', formData);

    // return NextResponse.json({ success: true });
    const files = formData.getAll('files') as File[];
    const placeId = formData.get('placeId') as string;
    const clerkId = formData.get('userId') as string;
    const category = formData.get('category') as string;

     // Fetch user based on clerkId
     const user = await prisma.user.findUnique({
      where: { clerkId: clerkId }
    });

    if (!user) {
      throw new Error("User not found for the provided clerkId");
    }

  const [city, rawState, rawCountry] = placeId.split(",").map((part) => part.trim());
  const state = rawState.replace(/^-/, "").replace(/^(.)/, (match) => match.toUpperCase()); // Removes the leading dash and capitalizes the first letter of the state
  const country = rawCountry.replace(/^-/, "").replace(/^(.)/, (match) => match.toUpperCase()); // Removes the leading dash and capitalizes the first letter of the country
  


    // return NextResponse.json({ success: true });
    
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

      const key = `places/${city}/${uuidv4()}-${file.name}`;
      
      await s3Client.send(new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: optimizedBuffer,
        ContentType: file.type,
      }));

      return {
        url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
        key
      };
    });

    const uploadedFiles = await Promise.all(uploadPromises);

    console.log('Uploaded files at the api level :', uploadedFiles);

    const newPlace = await prisma.place.create({
      data: {
        imageUrl: uploadedFiles[0].url, // Store the first uploaded image URL
        image: uploadedFiles.map(file => file.url), // Store all uploaded image URLs in the image array (if there are multiple)
        city,
        state,
        country,
        category,

        // Add any other fields that are required when creating a new place

        userId: user.id, // Assuming userId is part of formData
      }
    });

    return NextResponse.json({ 
      success: true, 
      files: uploadedFiles 
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Upload failed' },
      { status: 500 }
    );
  }
}