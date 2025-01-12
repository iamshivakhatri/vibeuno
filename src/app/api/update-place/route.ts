import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from "@/lib/db";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';


const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: Request) {
  try {
    const body = await request.json(); // Expecting JSON payload
    const { fileNames, placeId, userId } = body;

    // Fetch place by placeId to get the current image list and city name
    const place = await prisma.place.findUnique({
      where: { id: placeId },
      select: {
        id: true,
        image: true, // To update the image array
        city: true,  // Assuming the city field is available
      },
    });


    // return NextResponse.json({ success: true });  

    if (!place) {
      throw new Error("Place not found for the provided placeId");
    }

        // Generate presigned URLs for the new files
        const presignedData = await Promise.all(
          fileNames.map(async (fileName: string) => {
            const key = `places/${place.city}/${uuidv4()}-${fileName}`;
            const putObjectCommand = new PutObjectCommand({
              Bucket: process.env.AWS_BUCKET_NAME!,
              Key: key,
              ContentType: "application/octet-stream", // Default content type
            });
    
            const presignedUrl = await getSignedUrl(s3Client, putObjectCommand, {
              expiresIn: 3600,
            });
    
            return {
              presignedUrl,
              key,
              url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
            };
          })
        );
    


    // Step 3: Update the place's image field by appending the new image URLs to the existing list
    const updatedPlace = await prisma.place.update({
      where: { id: placeId },
      data: {
        image: [...(place.image as string[]), ...presignedData.map(file => file.url)],  // Append the new image URLs
      },
    });

    console.log('Updated place:', updatedPlace);
    console.log('Presigned Data:', presignedData);


    return NextResponse.json({
      success: true,
      presignedData,
      placeId: updatedPlace.id,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Upload failed' },
      { status: 500 }
    );
  }
}
