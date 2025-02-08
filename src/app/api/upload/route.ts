// import { NextResponse } from 'next/server';
// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
// import sharp from 'sharp';
// import { v4 as uuidv4 } from 'uuid';

// import { prisma } from "@/lib/db";

// const s3Client = new S3Client({
//   region: process.env.AWS_REGION!,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
//   },
// });


// export async function POST(request: Request) {
//   try {
//     const formData = await request.formData();
    
//     console.log('Form data:', formData);

//     // return NextResponse.json({ success: true });
//     const files = formData.getAll('files') as File[];
//     const placeId = formData.get('placeId') as string;
//     const clerkId = formData.get('userId') as string;
//     const category = formData.get('category') as string;

//      // Fetch user based on clerkId
//      const user = await prisma.user.findUnique({
//       where: { clerkId: clerkId }
//     });

//     if (!user) {
//       throw new Error("User not found for the provided clerkId");
//     }

//   const [city, rawState, rawCountry] = placeId.split(",").map((part) => part.trim());
//   const state = rawState.replace(/^-/, "").replace(/^(.)/, (match) => match.toUpperCase()); // Removes the leading dash and capitalizes the first letter of the state
//   const country = rawCountry.replace(/^-/, "").replace(/^(.)/, (match) => match.toUpperCase()); // Removes the leading dash and capitalizes the first letter of the country
  


//     // return NextResponse.json({ success: true });
    
//     const uploadPromises = files.map(async (file) => {
//       const buffer = Buffer.from(await file.arrayBuffer());
      
//       // Optimize image while maintaining quality
//       const optimizedBuffer = await sharp(buffer)
//         .resize(2000, 2000, { // Max dimensions
//           fit: 'inside',
//           withoutEnlargement: true
//         })
//         .jpeg({ 
//           quality: 85,
//           progressive: true,
//           mozjpeg: true
//         })
//         .toBuffer();

//       const key = `places/${city}/${uuidv4()}-${file.name}`;
      
//       await s3Client.send(new PutObjectCommand({
//         Bucket: process.env.AWS_BUCKET_NAME,
//         Key: key,
//         Body: optimizedBuffer,
//         ContentType: file.type,
//       }));

//       return {
//         url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
//         key
//       };
//     });

//     const uploadedFiles = await Promise.all(uploadPromises);

//     console.log('Uploaded files at the api level :', uploadedFiles);

//     const newPlace = await prisma.place.create({
//       data: {
//         imageUrl: uploadedFiles[0].url, // Store the first uploaded image URL
//         image: uploadedFiles.map(file => file.url), // Store all uploaded image URLs in the image array (if there are multiple)
//         city,
//         state,
//         country,
//         category,

//         // Add any other fields that are required when creating a new place

//         userId: user.id, // Assuming userId is part of formData
//       }
//     });

//     return NextResponse.json({ 
//       success: true, 
//       files: uploadedFiles 
//     });
//   } catch (error) {
//     console.error('Upload error:', error);
//     return NextResponse.json(
//       { success: false, error: 'Upload failed' },
//       { status: 500 }
//     );
//   }
// }

// api/upload/route.ts
// import { NextResponse } from 'next/server';
// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
// import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
// import { v4 as uuidv4 } from 'uuid';
// import { prisma } from "@/lib/db";

// const s3Client = new S3Client({
//   region: process.env.AWS_REGION!,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
//   },
// });

// export async function POST(request: Request) {
//   try {
//     const formData = await request.formData();
//     const filesInfo = formData.getAll('files')
//       .filter((entry): entry is File => entry instanceof File)
//       .map((file) => ({
//         name: file.name,
//         type: file.type
//       }));
//     const placeId = formData.get('placeId') as string;
//     const clerkId = formData.get('userId') as string;
//     const category = formData.get('category') as string;

//     // Fetch user based on clerkId
//     const user = await prisma.user.findUnique({
//       where: { clerkId: clerkId }
//     });

//     if (!user) {
//       throw new Error("User not found for the provided clerkId");
//     }

//     const [city, rawState, rawCountry] = placeId.split(",").map((part) => part.trim());
//     const state = rawState.replace(/^-/, "").replace(/^(.)/, (match) => match.toUpperCase());
//     const country = rawCountry.replace(/^-/, "").replace(/^(.)/, (match) => match.toUpperCase());

//     // Generate presigned URLs for each file
//     const presignedData = await Promise.all(
//       filesInfo.map(async (fileInfo) => {
//         const key = `places/${city}/${uuidv4()}-${fileInfo.name}`;
//         const putObjectCommand = new PutObjectCommand({
//           Bucket: process.env.AWS_BUCKET_NAME!,
//           Key: key,
//           ContentType: fileInfo.type,
//         });

//         const presignedUrl = await getSignedUrl(s3Client, putObjectCommand, {
//           expiresIn: 3600,
//         });

//         return {
//           presignedUrl,
//           key,
//           url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
//         };
//       })
//     );

//     // Create place in database with the expected URLs
//     const newPlace = await prisma.place.create({
//       data: {
//         imageUrl: presignedData[0].url,
//         image: presignedData.map(file => file.url),
//         city,
//         state,
//         country,
//         category,
//         userId: user.id,
//       }
//     });

//     return NextResponse.json({
//       success: true,
//       presignedData,
//       placeId: newPlace.id
//     });
//   } catch (error) {
//     console.error('Upload error:', error);
//     return NextResponse.json(
//       { success: false, error: 'Upload failed' },
//       { status: 500 }
//     );
//   }
// }



import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
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
    const body = await request.json(); // Expecting JSON payload
    const { fileNames, placeId, userId, category, name, caption, description  } = body;

    console.log("filenames, placeId, userId, category", fileNames, placeId, userId, category);

    // Fetch user based on userId
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      throw new Error("User not found for the provided userId");


    }

    const [city, rawState, rawCountry] = placeId.split(",").map((part: string) => part.trim());
    const state = rawState.replace(/^-/, "").replace(/^(.)/, (match: string) => match.toUpperCase());
    const country = rawCountry.replace(/^-/, "").replace(/^(.)/, (match: string) => match.toUpperCase());

    // Generate presigned URLs for each file
    const presignedData = await Promise.all(
      fileNames.map(async (fileName: string) => {
        const key = `places/${city}/${uuidv4()}-${fileName}`;
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

    // Create place in database with the expected URLs
    const newPlace = await prisma.place.create({
      data: {
        imageUrl: presignedData[0]?.url || null,
        image: presignedData.map(file => file.url),
        city,
        state,
        country,
        category,
        name,
        caption,
        description,
        userId: user.id,
      },
    });

    return NextResponse.json({
      success: true,
      presignedData,
      placeId: newPlace.id,
    });

    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Upload failed' },
      { status: 500 }
    );
  }
}
