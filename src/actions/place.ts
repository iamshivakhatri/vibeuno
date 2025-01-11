// actions/place.ts
"use server"

import { prisma } from "@/lib/db";
import { auth } from '@clerk/nextjs/server'

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation";


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


    // Create the place
    const place = await prisma.place.create({
      data: newData // Use the modified data with userId
    });

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
      name: item.place.name || '', // Ensure name is always a string
      category: item.place.category || '', // Ensure category is always a string
      _count: {
        votes: item.place._count?.votes || 0,  // Ensure votes field is populated
      },
    }));
  } catch (error) {
    console.error('Error fetching wishlist places:', error);
    throw new Error('Error fetching wishlist places');
  }
}

// Fetch a place by ID, including images, and related user data.
export async function getPlaceById(placeId: string) {
  const { userId } = await auth()
   if (!userId) {
    redirect('/sign-in')
  }
  
  const place = await prisma.place.findUnique({
    where: { id: placeId },
    include: {
      user: true,   // Including the user who created the place.

    },
  });




  // Handle case when place is not found.
  if (!place) {
    const { userId } = await auth()
    const user = await prisma.user.findUnique({
      where: { clerkId: userId as string }
    })
    return redirect(`/profile/${user?.id}`);

  }

  return place;
}


export async function getPlaceVisitors(placeId: string) {
  // First, get the original place details
  const originalPlace = await prisma.place.findUnique({
    where: { id: placeId },
    select: {
      state: true,
      city: true,
      country: true
    }
  });

  if (!originalPlace) return [];

  // Then find all places (and their users) that match these criteria
  const places = await prisma.place.findMany({
    where: {
      state: originalPlace.state,
      city: originalPlace.city,
      country: originalPlace.country
    },
    select: {
      user: {
        select: {
          id: true,
          name: true,
          profileUrl: true,
        }
      }
    }
  });


  // Extract and deduplicate users
  const uniqueUsers = new Map();
  places.forEach(place => {
    if (place.user) {
      uniqueUsers.set(place.user.id, place.user);
    }
  });

  return Array.from(uniqueUsers.values());
}



export async function deletePlace(placeId: string, userId: string) {
  try {
    

    await prisma.vote.deleteMany({
      where: {
        placeId: placeId,  // Ensure the votes are related to this place
      },
    });

    await prisma.wishlistItem.deleteMany({
      where: {
        placeId: placeId,  // Ensure the wishlist items are related to this place
      },
    });


    await prisma.place.delete({
      where: {
        id: placeId,
      },
    })

    revalidatePath('/places')
    redirect(`profile/${userId}`)
    return { success: true }
  } catch (error) {
    console.error('Failed to delete place:', error)
    return { success: false, error: 'Failed to delete place' }
  }
}

export async function deleteImage(placeId: string, imageIndex: number) {
  try {
    const place = await prisma.place.findUnique({
      where: { id: placeId },
      select: { image: true }
    })

    if (!place?.image) {
      throw new Error('Place or image not found')
    }

    const imagesArray = Array.isArray(place.image) ? place.image : [];
    const updatedImages = imagesArray.filter((_, index) => index !== imageIndex);

    await prisma.place.update({
      where: { id: placeId },
      data: { image: updatedImages }
    })

    revalidatePath(`/places/${placeId}`)
    return { success: true }
  } catch (error) {
    console.error('Failed to delete image:', error)
    return { success: false, error: 'Failed to delete image' }
  }
}

export async function updateDescription(placeId: string, description: string) {
  try {
    await prisma.place.update({
      where: { id: placeId },
      data: { description }
    })

    revalidatePath(`/places/${placeId}`)
    return { success: true }
  } catch (error) {
    console.error('Failed to update description:', error)
    return { success: false, error: 'Failed to update description' }
  }
}


// export async function voteForPlace(placeId: string, userId: string) {
//   try {
//     console.log('Voting for place:', { placeId, userId });

//     // Check if the user exists
//     const user = await prisma.user.findUnique({
//       where: { clerkId: userId },
//     });

//     if (!user) {
//       throw new Error('User not found');
//     }

//     console.log('User:', user.id);

//     // Check if the vote already exists
//     const existingVote = await prisma.vote.findUnique({
//       where: {
//         placeId_userId: {
//           placeId,
//           userId: user.id,
//         },
//       },
//     });

//     if (existingVote) {
//       // Vote exists, so remove the upvote by deleting the record
//       await prisma.vote.delete({
//         where: {
//           id: existingVote.id,
//         },
//       });
//       console.log('Vote removed successfully');
//       return { status: 200, vote: 0 };
//     } else {
//       // No vote exists, so create a new upvote
//       const newVote = await prisma.vote.create({
//         data: {
//           placeId,
//           userId: user.id,
//         },
//       });
//       console.log('Vote added successfully');
//       return { status: 200, vote: 1 };
//     }
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

    // Get the place and check if user has already voted
    const place = await prisma.place.findUnique({
      where: { id: placeId },
      select: {
        votedUsers: true,
        numVotes: true,
      },
    });

    if (!place) {
      throw new Error('Place not found');
    }

    const hasVoted = place.votedUsers.some(votedUser => votedUser.id === user?.id);

    // Update the place with new vote data
    const updatedPlace = await prisma.place.update({
      where: { id: placeId },
      data: {
        numVotes: hasVoted ? place.numVotes - 1 : place.numVotes + 1,
        votedUsers: hasVoted
          ? { disconnect: { id: user.id } }
          : { connect: { id: user.id } }
      },
    });

    return { status: 200, vote: hasVoted ? 0 : 1 };

  } catch (error) {
    console.error('Error voting for place:', error);
    throw new Error('Unable to vote for place');
  }
}