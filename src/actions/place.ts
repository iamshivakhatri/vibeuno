// actions/place.ts
"use server"

import { prisma } from "@/lib/db";

export async function addPlace(formData: {
  name?: string;
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




// export async function getUserPlaces(userId: string) {
//   try {
//     // Fetch the visited places associated with the given userId
//     const places = await prisma.place.findMany({
//       where: {
//         userId: userId,  // Filter by userId to get visited places
//       },
//       select: {
//         id: true,
//         name: true,
//         description: true,
//         state: true,
//         city: true,
//         category: true,
//         imageUrl: true,
//         createdAt: true,
//       },
//     });

//     return places;  // Returning the list of places
//   } catch (error) {
//     console.error('Error fetching visited places:', error);
//     throw new Error('Error fetching visited places');
//   }
// }


// export async function getUserWishlist(userId: string) {
//   try {
//     // Fetch the wishlist places associated with the given userId
//     const wishlistPlaces = await prisma.wishlistItem.findMany({
//       where: {
//         userId: userId,  // Filter by userId to get wishlist places
//       },
//       include: {
//         place: {  // Join with the Place model to get place details
//           select: {
//             id: true,
//             name: true,
//             description: true,
//             state: true,
//             city: true,
//             category: true,
//             imageUrl: true,
//             createdAt: true,
//           },
//         },
//       },
//     });

//     // Returning the list of places from the wishlist
//     return wishlistPlaces.map((item) => item.place);
//   } catch (error) {
//     console.error('Error fetching wishlist places:', error);
//     throw new Error('Error fetching wishlist places');
//   }
// }


type Place = {
  state: string; // State where the place is located
  name: string; // Name of the place
  id: string; // Unique ID for the place
  description: string | null; // Description of the place, may be null
  city: string; // City where the place is located
  category: string; // Category of the place (e.g., "entertainment")
  imageUrl: string | null; // URL of an image associated with the place, may be null
  _count: {
    votes: number; // Number of votes for the place
  };
};

export async function getUserPlaces(userId: string): Promise<Place[]> {
  try {
    // Fetch the visited places associated with the given userId
    const places = await prisma.place.findMany({
      where: {
        userId: userId,  // Filter by userId to get visited places
      },
      select: {
        id: true,
        name: true,
        description: true,
        state: true,
        city: true,
        category: true,
        imageUrl: true,
        createdAt: true,
        _count: {
          select: {
            votes: true,  // Select the count of votes
          },
        },
      },
    });

    return places.map((place) => ({
      ...place,
      name: place.name || '', // Ensure name is always a string
      category: place.category || '', // Ensure category is always a string
      _count: {
        votes: place._count?.votes || 0,  // Ensure votes field is populated
      },
    }));
  } catch (error) {
    console.error('Error fetching visited places:', error);
    throw new Error('Error fetching visited places');
  }
}

export async function getUserWishlist(userId: string): Promise<Place[]> {
  try {
    // Fetch the wishlist places associated with the given userId
    const wishlistPlaces = await prisma.wishlistItem.findMany({
      where: {
        userId: userId,  // Filter by userId to get wishlist places
      },
      include: {
        place: {  // Join with the Place model to get place details
          select: {
            id: true,
            name: true,
            description: true,
            state: true,
            city: true,
            category: true,
            imageUrl: true,
            createdAt: true,
            _count: {
              select: {
                votes: true,  // Select the count of votes
              },
            },
          },
        },
      },
    });

    // Map the wishlist data to the Place type format
    return wishlistPlaces.map((item) => ({
      ...item.place,
      _count: {
        votes: item.place._count?.votes || 0,  // Ensure votes field is populated
      },
    }));
  } catch (error) {
    console.error('Error fetching wishlist places:', error);
    throw new Error('Error fetching wishlist places');
  }
}


