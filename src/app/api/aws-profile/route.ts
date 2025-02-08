// import { NextResponse } from 'next/server';
// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
// import sharp from 'sharp';
// import { v4 as uuidv4 } from 'uuid';
// import { prisma } from '@/lib/db';

// const s3Client = new S3Client({
//   region: process.env.AWS_REGION!,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
//   },
// });

// export async function POST(req: Request) {
//   try {
//     const formData = await req.formData();
//     const file = formData.get('file') as Blob;
//     const id = formData.get('id') as string;

 

//     const user = await prisma.user.findUnique({
//         where: { id }
//       });


//     if (!user) {
//       return NextResponse.json({ error: 'User not found' }, { status: 404 });
//     }

//     if (!file) {
//       return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
//     }

//     // Convert Blob to Buffer
//     const arrayBuffer = await file.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);

//     // Resize the image using Sharp
//     const resizedImageBuffer = await sharp(buffer)
//       .resize({ width: 400, height: 400, fit: 'cover' })
//       .toBuffer();

//     // Generate a unique filename
//     const fileName = `profile/${uuidv4()}.jpg`;

//     // Upload to S3
//     const uploadParams = {
//       Bucket: process.env.AWS_BUCKET_NAME!,
//       Key: fileName,
//       Body: resizedImageBuffer,
//       ContentType: 'image/jpeg',
//     };

//     await s3Client.send(new PutObjectCommand(uploadParams));

//     const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

//     // Save the image URL to the database
//     await prisma.user.update({
//       where: { id: user.id },
//       data: { profileUrl: imageUrl },
//     });

//     return NextResponse.json({ success: true, imageUrl });
//   } catch (error) {
//     console.error('Error uploading file:', error);
//     return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
//   }
// }
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
    console.log('this is the body', body);
    const { id } = body;

    console.log('this is the user id', id);

    // Fetch user by userId to ensure the user exists
    const user = await prisma.user.findUnique({
      where: { id: id },
      select: {
        id: true,
        profileUrl: true, // To update the profile URL
      },
    });

    if (!user) {
      throw new Error('User not found for the provided userId');
    }

    // Generate a unique filename for the profile picture
    const fileName = `profile/${uuidv4()}.jpg`;

    // Generate a presigned URL for uploading the profile picture
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

    // Update the user's profile URL in the database
    await prisma.user.update({
      where: { id: id },
      data: { profileUrl: imageUrl },
    });

    console.log('this is the presigned url', presignedUrl);

 
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