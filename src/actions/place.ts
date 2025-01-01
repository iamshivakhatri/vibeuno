// actions/place.ts
"use server"

import { prisma } from "@/lib/db";

export async function addPlace(formData: {
  name: string;
  description: string;
  imageUrl: string;
  clerkId?: string;  // clerkId is received as input
  state: string;
  city: string;
  category: string;
}) {
  try {
    console.log("Form Data:", formData); // Debugging: Log the form data

    // Fetch user based on clerkId
    const user = await prisma.user.findUnique({
      where: { clerkId: formData.clerkId }
    });

    if (!user) {
      throw new Error("User not found for the provided clerkId");
    }

    // Remove clerkId from formData and add the userId to create the new place
    const newData = { ...formData, userId: user.id };
    delete newData.clerkId; // Optionally remove clerkId if it's in the formData

    console.log("New Data:", newData); // Debugging: Log the modified data

    // Create the place
    const place = await prisma.place.create({
      data: newData // Use the modified data with userId
    });

    console.log("Place added:", place);
    return place;
  } catch (error) {
    console.error("Error adding place:", error);
    throw error;
  }
}


export async function getPlaces(state: string) {
  return prisma.place.findMany({
    where: { state },
    include: {
      _count: {
        select: { votes: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}

// export async function voteForPlace(placeId: string, userId: string) {
//   try {

//     console.log('Voting for place:', { placeId, userId });
//     // Check if the user exists
//     const user = await prisma.user.findUnique({
//       where: { clerkId: userId }
//     });


    

//     if (!user) {
//       throw new Error('User not found');
//     }

//     console.log('User:', user.id);

//     // Proceed with creating the vote if the user exists
//     return await prisma.vote.create({
//       data: {
//         placeId,
//         userId:user.id
//       }
//     });
//   } catch (error) {
//     console.error('Error voting for place:', error);
//     throw new Error('Unable to vote for place');
//   }
// }

export async function voteForPlace(placeId: string, userId: string) {
  try {
    console.log('Voting for place:', { placeId, userId });

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    console.log('User:', user.id);

    // Check if the vote already exists
    const existingVote = await prisma.vote.findUnique({
      where: {
        placeId_userId: {
          placeId,
          userId: user.id,
        },
      },
    });

    if (existingVote) {
      // Vote exists, so remove the upvote by deleting the record
      await prisma.vote.delete({
        where: {
          id: existingVote.id,
        },
      });
      console.log('Vote removed successfully');
      return { status: 200, vote: 0 };
    } else {
      // No vote exists, so create a new upvote
      const newVote = await prisma.vote.create({
        data: {
          placeId,
          userId: user.id,
        },
      });
      console.log('Vote added successfully');
      return { status: 200, vote: 1 };
    }
  } catch (error) {
    console.error('Error voting for place:', error);
    throw new Error('Unable to vote for place');
  }
}




