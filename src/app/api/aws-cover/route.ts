// import { NextResponse } from 'next/server';
// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';


// import sharp from 'sharp';
// import { v4 as uuidv4 } from 'uuid';
// import { prisma } from '@/lib/db';


// const s3Client = new S3Client({
//     region: process.env.AWS_REGION!,
//     credentials: {
//       accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
//       secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
//     },
//   });

// export async function POST(req: Request) {
    
//     try {
//       const formData = await req.formData();
//       const file = formData.get('file') as Blob;
//       const userId = formData.get('id') as string;  // Get the userId to save the cover photo for the correct user
  
//       const user = await prisma.user.findUnique({
//           where: { id: userId },
//       });
  
//       if (!user) {
//           return NextResponse.json({ error: 'User not found' }, { status: 404 });
//       }
  
//       if (!file) {
//         return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
//       }
  
//       // Convert Blob to Buffer
//       const arrayBuffer = await file.arrayBuffer();
//       const buffer = Buffer.from(arrayBuffer);
  
//       // Resize the image using Sharp
//       const resizedImageBuffer = await sharp(buffer)
//         .resize({ width: 1440, height: 320, fit: 'cover' })
//         .toBuffer();
  
//       // Generate a unique filename for the cover photo
//       const fileName = `cover/${uuidv4()}.jpg`;
  
//       // Upload to S3
//       const uploadParams = {
//         Bucket: process.env.AWS_BUCKET_NAME!,
//         Key: fileName,
//         Body: resizedImageBuffer,
//         ContentType: 'image/jpeg',
//       };
  
//     //   await S3Client.send(new PutObjectCommand(uploadParams));

//       await s3Client.send(new PutObjectCommand(uploadParams));

  
//       const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
  
//       // Save the cover photo URL to the database
//       await prisma.user.update({
//         where: { id: user.id }, // Replace with dynamic user ID
//         data: { coverPhotoUrl: imageUrl },
//       });
  
//       return NextResponse.json({ success: true, imageUrl });
//     } catch (error) {
//       console.error('Error uploading file:', error);
//       return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
//     }
//   }
  

import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '@/lib/db';

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
    const { id } = body;

    // Fetch user by userId to ensure the user exists
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        coverPhotoUrl: true, // To update the cover photo URL
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found for the provided userId' },
        { status: 404 }
      );
    }

    // Generate a unique filename for the cover photo
    const fileName = `cover/${uuidv4()}.jpg`;

    // Generate a presigned URL for uploading the cover photo
    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: fileName,
      ContentType: 'image/jpeg', // Ensure the correct content type for images
    });

    const presignedUrl = await getSignedUrl(s3Client, putObjectCommand, {
      expiresIn: 3600, // URL expires in 1 hour
    });

    // Construct the final image URL
    const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    // Update the user's cover photo URL in the database
    await prisma.user.update({
      where: { id },
      data: { coverPhotoUrl: imageUrl },
    });

    return NextResponse.json({
      success: true,
      presignedUrl,
    });
  } catch (error) {
    console.error('Error generating presigned URL or updating database:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate presigned URL or update database' },
      { status: 500 }
    );
  }
}