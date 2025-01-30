// actions/place.ts
"use server"

import { prisma } from "@/lib/db";
import { auth } from '@clerk/nextjs/server'

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation";

import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";





// export async function addPlace(formData: {
//   name?: string;
//   description: string;
//   imageUrl: string;
//   clerkId?: string;  // clerkId is received as input
//   state: string;
//   city: string;
//   category: string;
// }) {
//   try {

//     // Fetch user based on clerkId
//     const user = await prisma.user.findUnique({
//       where: { clerkId: formData.clerkId }
//     });

//     if (!user) {
//       throw new Error("User not found for the provided clerkId");
//     }

//     // Remove clerkId from formData and add the userId to create the new place
//     const newData = { ...formData, userId: user.id };
//     delete newData.clerkId; // Optionally remove clerkId if it's in the formData


//     // Create the place
//     const place = await prisma.place.create({
//       data: newData // Use the modified data with userId
//     });

//     return place;
//   } catch (error) {
//     console.error("Error adding place:", error);
//     throw error;
//   }
// }


export async function populateCities() {
  try {
    // Step 1: Retrieve all places that do not have a cityId
    const placesWithoutCityId = await prisma.place.findMany({
      where: {
        cityId: null,  // Only fetch places where the cityId is not set
      },
    });

    // Step 2: Loop through each place and ensure the city exists in the City table
    for (const place of placesWithoutCityId) {
      // Check if the city exists based on city, state, and country
      const city = await prisma.city.upsert({
        where: {
          name_state_country: {
            name: place.city,
            state: place.state,
            country: place.country || "Unknown", // Default to "Unknown" if no country is provided
          },
        },
        create: {
          name: place.city,
          state: place.state,
          country: place.country || "Unknown", // Default to "Unknown" if no country is provided
          description: `Community for ${place.city}, ${place.state}`, // Optional: You can customize this
          coverImage: `https://source.unsplash.com/featured/?${place.city}`, // Optional: You can customize this
        },
        update: {}, // Do nothing if the city already exists
      });

      // Step 3: Update the Place record with the cityId of the newly created or found city
      await prisma.place.update({
        where: { id: place.id },
        data: { cityId: city.id }, // Set the cityId on the place record
      });

      console.log(`Place ${place.id} updated with city ${city.name} (${city.id})`);
    }

    console.log("Cities populated successfully for all places.");
  } catch (error) {
    console.error("Error populating cities:", error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function addPlace(formData: {
  name?: string;
  description: string;
  imageUrl: string;
  clerkId?: string; // clerkId is received as input
  state: string;
  city: string;
  category: string;
}) {
  try {
    // Fetch user based on clerkId
    const user = await prisma.user.findUnique({
      where: { clerkId: formData.clerkId },
    });

    if (!user) {
      throw new Error("User not found for the provided clerkId");
    }

    // Ensure the city exists or create it
    const city = await prisma.city.upsert({
      where: {
        name_state_country: {
          name: formData.city,
          state: formData.state,
          country: "USA", // Replace with dynamic country if needed
        },
      },
      create: {
        name: formData.city,
        state: formData.state,
        country: "USA", // Replace with dynamic country if needed
        description: `Community for ${formData.city}, ${formData.state}`, // Optional: You can customize this
        coverImage: `https://source.unsplash.com/featured/?${formData.city}`, // Optional: You can customize this
      },
      update: {}, // No updates needed, as `upsert` ensures it's created if missing
    });

    // Remove clerkId from formData and add the userId and cityId to create the new place
    const newData = {
      ...formData,
      userId: user.id,
      cityId: city.id, // Associate the place with the city's ID
    };
    delete newData.clerkId; // Optionally remove clerkId if it's in the formData

    // Create the place
    const place = await prisma.place.create({
      data: newData, // Use the modified data with userId and cityId
    });

    return place;
  } catch (error) {
    console.error("Error adding place:", error);
    throw error;
  }
}


export async function getCityData(name: string) {

  if (!name) {
    console.error("No city name provided");
    return [];
  }

  try {
    const cityData = await prisma.city.findMany({
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
      include: {
        _count: {
          select: { places: true },
        },
        places: {
          select: {
            id: true,
            name: true,
            caption: true,
            description: true,
            imageUrl: true,
            image: true,
            city: true,
            category: true,
            numVotes: true,
            createdAt: true,
            comments: {
              select: {
                id: true,
                content: true,
                createdAt: true,
                likes: true,
                parentId: true,
                user: {
                  select: {
                    id: true,
                    name: true,
                    profileUrl: true,
                    occupation: true,
                  },
                },
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                profileUrl: true,
                occupation: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (cityData.length === 0) {
      console.log("No cities found with the name:", name);
      return [];
    }

    return cityData;
  } catch (error) {
    console.error("Error fetching city data:", error);
    return [];
  }
}


export async function deleteComment(commentId: string): Promise<void> {
  try {
    await prisma.comment.delete({
      where: { id: commentId },
    });
  } catch (error) {
    console.error(`Error deleting comment with ID ${commentId}:`, error);
    throw new Error("Failed to delete comment.");
  }
}






export async function getPlaces(state?: string) {
  return prisma.place.findMany({
    where: { state  },
    include: {
      _count: {
        select: { votes: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}



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
  // userId is actual userid
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
        image: true,
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
            image: true,
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
  // const { userId } = await auth()
  //  if (!userId) {
  //   redirect('/sign-in')
  // }
  
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



export async function voteForPlace(placeId: string, userId: string, hasVoted?: boolean) {

  // here userId is clerkId
  try {


    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }


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




// export async function deletePlace(placeId: string, userId: string) {
//   try {
    

//     await prisma.vote.deleteMany({
//       where: {
//         placeId: placeId,  // Ensure the votes are related to this place
//       },
//     });

//     await prisma.wishlistItem.deleteMany({
//       where: {
//         placeId: placeId,  // Ensure the wishlist items are related to this place
//       },
//     });


//     await prisma.place.delete({
//       where: {
//         id: placeId,
//       },
//     })

//     revalidatePath('/places')
//     redirect(`profile/${userId}`)
//     return { success: true }
//   } catch (error) {
//     console.error('Failed to delete place:', error)
//     return { success: false, error: 'Failed to delete place' }
//   }
// }

// export async function deleteImage(placeId: string, imageIndex: number) {
//   try {
//     const place = await prisma.place.findUnique({
//       where: { id: placeId },
//       select: { image: true }
//     })

//     if (!place?.image) {
//       throw new Error('Place or image not found')
//     }

//     const imagesArray = Array.isArray(place.image) ? place.image : [];
//     const updatedImages = imagesArray.filter((_, index) => index !== imageIndex);

//     await prisma.place.update({
//       where: { id: placeId },
//       data: { image: updatedImages }
//     })

//     revalidatePath(`/places/${placeId}`)
//     return { success: true }
//   } catch (error) {
//     console.error('Failed to delete image:', error)
//     return { success: false, error: 'Failed to delete image' }
//   }
// }


const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Helper function to extract key from S3 URL
function getS3KeyFromUrl(url: string): string {
  const urlObj = new URL(url);
  // Remove the leading slash
  return urlObj.pathname.substring(1);
}

// Helper function to delete a single image from S3
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

export async function deletePlace(placeId: string, userId: string) {
  try {
    // First, get the place and its images
    const place = await prisma.place.findUnique({
      where: { id: placeId },
      select: { image: true },
    });

    if (!place) {
      throw new Error('Place not found');
    }

    // Delete all images from S3
    // const deletePromises = place.image.map((imageUrl: string) => 
    //   deleteFromS3(imageUrl)
    // );

    // // Wait for all S3 deletions to complete
    // await Promise.all(deletePromises);

    // Ensure image is an array and handle potential null/undefined values
    const images = place.image as string[];
    if (Array.isArray(images) && images.length > 0) {
      // Delete all images from S3
      const deletePromises = images.map((imageUrl) => 
        deleteFromS3(imageUrl)
      );

      // Wait for all S3 deletions to complete
      await Promise.all(deletePromises);
    }
    // Then delete all related records from the database
    await prisma.vote.deleteMany({
      where: {
        placeId: placeId,
      },
    });

    await prisma.wishlistItem.deleteMany({
      where: {
        placeId: placeId,
      },
    });

    await prisma.place.delete({
      where: {
        id: placeId,
      },
    });

    // revalidatePath('/places');
    // redirect(`profile/${userId}`);
    return { success: true };
  } catch (error) {
    console.error('Failed to delete place:', error);
    return { success: false, error: 'Failed to delete place' };
  }
}

export async function deleteImage(placeId: string, imageIndex: number) {
  try {
    const place = await prisma.place.findUnique({
      where: { id: placeId },
      select: { image: true }
    });

    if (!place?.image) {
      throw new Error('Place or image not found');
    }

    const imagesArray = Array.isArray(place.image) ? place.image : [];
    const imageToDelete = imagesArray[imageIndex] as string;

    if (!imageToDelete) {
      throw new Error('Image not found at specified index');
    }

    // Delete the image from S3
    await deleteFromS3(imageToDelete);

    // Update the database after successful S3 deletion
    const updatedImages = imagesArray.filter((_, index) => index !== imageIndex);
    
    await prisma.place.update({
      where: { id: placeId },
      data: { 
        image: updatedImages,
        // Update imageUrl if we're deleting the first image
        ...(imageIndex === 0 && updatedImages.length > 0 ? 
          { imageUrl: updatedImages[0] as string } : 
          {})
      }
    });

    revalidatePath(`/places/${placeId}`);
    return { success: true };
  } catch (error) {
    console.error('Failed to delete image:', error);
    return { success: false, error: 'Failed to delete image' };
  }
}



// export async function getPopularPlaces() {
//   try {
//     const places = await prisma.place.findMany({
//       orderBy: {
//         numVotes: 'desc'
//       },
//       take: 6, // Limit to top 6 places
//     });
//     console.log('Popular places:', places);
//     return places;
//   } catch (error) {
//     console.error('Error fetching popular places:', error);
//     return [];
//   }
// }

export async  function getPopularPlaces() {

  const places = await prisma.place.findMany({
    orderBy: {
      numVotes: 'desc',
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          profileUrl: true,
        },
      },
    },
    take: 6, // Limit to top 6 places
  });


  return places;
    
}



export async function updatePlaceDetails(placeId: string, data: { name: string }) {
  try {
    const response = await prisma.place.update({
      where: { id: placeId },
      data: { name: data.name }
    });

    revalidatePath(`/places/${placeId}`);
    return { success: true };
  } catch (error) {
    console.error('Failed to update place name:', error);
    return { success: false };
  }
}

export async function getPlacesData() {
  try {
    const places = await prisma.place.findMany({
      where: {
        name: {
          not: null,
        },
        AND: {
          name: {
            not: '',
          },
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        imageUrl: true,
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    });

    return places;
  } catch (error) {
    console.error("Error fetching places:", error);
    return [];
  }
}




// export async function getCities() {
//   try {
//     const places = await prisma.place.findMany({
//       select: {
//         id: true,
//         name: true,
//         description: true,
//         imageUrl: true,
//         category: true,
//         city: true,
//         country: true,
//         state: true,
       
//       },
//       orderBy: {
//         createdAt: 'desc',
//       },
//       take: 50,
//     });

//     return places;
//   } catch (error) {
//     console.error("Error fetching places:", error);
//     return [];
//   }
// }
export async function getCities() {
  try {
    const cities = await prisma.city.findMany({
      select: {
        id: true,
        name: true,
        state: true,
        country: true,
        description: true,
        coverImage: true,
        createdAt: true,
        updatedAt: true,
        places: {
          select: {
            image:true,
            imageUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    });

    return cities;
  } catch (error) {
    console.error("Error fetching cities:", error);
    return [];
  }
}




export async function getPost() {
  try {
    const places = await prisma.place.findMany({
      select: {
        id: true,
        name: true,
        caption: true,
        description: true,
        imageUrl: true,
        image: true, // Ensure this is an array of strings
        city: true,
        category: true,
        numVotes: true,
        createdAt: true,
        comments: {
          select: {
            id: true,
            content: true,
            userId: true,
            placeId: true,
            createdAt: true,
            editedAt: true,
            isEdited: true,
            likes: {
              select: {
                userId: true,
                id: true,
                createdAt: true,
                commentId: true,
              },
            },
            reported: true,
            parentId: true,
            visible: true,
            user: {
              select: {
                id: true,
                name: true,
                profileUrl: true,
                occupation: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            profileUrl: true,
            occupation: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform data to ensure types align
    return  places

  } catch (error) {
    console.error("Error fetching places:", error);
    return [];
  }
}





type CreateCommentInput = {
  content: string;
  userId: string; // The ID of the user creating the comment
  placeId: string; // The ID of the Place (post) to which the comment belongs
  parentId?: string; // Optional: For replies to another comment
};

export async function createComment(data: CreateCommentInput) {
  try {
    const { content, userId, placeId, parentId } = data;

    if (!content || !userId || !placeId) {
      throw new Error("Content, userId, and placeId are required");
    }

    const newComment = await prisma.comment.create({
      data: {
        content,
        userId,
        placeId,
        parentId, // Can be undefined if it's not a reply
      },
    });

    return newComment;
  } catch (error) {
    console.error("Error creating comment:", error);
    throw new Error("Failed to create comment");
  }
}



interface LikeCommentInput {
  userId: string;
  commentId: string;
}

export async function toggleCommentLike({ userId, commentId }: LikeCommentInput) {
  try {
    // Check if the user has already liked the comment
    const existingLike = await prisma.like.findFirst({
      where: {
        userId: userId,
        commentId: commentId,
      },
    });

    if (existingLike) {
      // User has already liked the comment, so remove the like
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });

      return { message: "Like removed successfully", action: "unlike" };
    } else {
      // User hasn't liked the comment, so add a like
      await prisma.like.create({
        data: {
          userId: userId,
          commentId: commentId,
        },
      });

      return { message: "Like added successfully", action: "like" };
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    throw new Error("Unable to toggle like. Please try again later.");
  }
}



interface bookMarkPlaceProps {
  userId: string;
  placeId: string;
}


export async function bookMarkPlace({placeId, userId}: bookMarkPlaceProps){
  try{
    const existingBookmark = await prisma.wishlistItem.findFirst({
      where: {
        userId,
        placeId
      }
    })

    if(existingBookmark){
      await prisma.wishlistItem.delete({
        where: {
          id: existingBookmark.id
        }
      })
      return {message: 'Bookmark Removed.', action: 'unbookmark'}
    }

    await prisma.wishlistItem.create({
      data: {
        userId,
        placeId
      }
    })
    return {message: 'Bookmarked successfully', action: 'bookmark'}

  }catch(error){
    console.error('Error bookmarking place:', error);
    return { error: 'Failed to bookmark place' };
  }
}

export async function getAllCityName(){
  const cities = await prisma.city.findMany({
    select: {
      name: true,
      country: true
    }
  })

  return cities
}



type Comment = {
  id: string;
  content: string;
  user: {
    id: string;
    name: string;
    profileUrl: string | null;
    occupation: string | null;
  };
  userId: string;
  placeId: string;
  createdAt: Date;
  editedAt: Date | null;
  isEdited: boolean;
  likes: number;
  reported: boolean;
  parentId: string | null;
  visible: boolean;
};

// server.ts
export async function getCommentsByPlaceId(placeId: string, userId: string): Promise<Comment[]> {
  try {
    const comments = await prisma.comment.findMany({
      where: { 
        placeId, 
        visible: true 
      },
      orderBy: { 
        createdAt: 'desc' 
      },
      select: {
        id: true,
        content: true,
        userId: true,
        placeId: true,
        createdAt: true,
        editedAt: true,
        isEdited: true,
        reported: true,
        parentId: true,
        visible: true,
        user: {
          select: {
            id: true,
            name: true,
            profileUrl: true,
            occupation: true,
          },
        },
        likes: {
          select: {
            userId: true,  // Fetch the list of users who liked this comment
          },
        },
        _count: {
          select: {
            likes: true
          }
        }
      },
    });

    console.log('Comments at here:', comments);


    // Transform the response to match the Comment type
    return comments.map(comment => ({
      ...comment,
      likes: comment._count.likes,
      hasUserLiked: comment.likes.some(like => like.userId === userId), // Check if the logged-in user has liked the comment      
      user: {
        id: comment.user.id,
        name: comment.user.name || '',
        profileUrl: comment.user.profileUrl,
        occupation: comment.user.occupation,
      }
    }));

  } catch (error) {
    console.error('Error fetching comments:', error);
    throw new Error('Failed to fetch comments');
  }
}



export async function isPlaceInWishlist(placeId: string, userId: string): Promise<boolean> {
  if (!placeId || !userId) throw new Error("Missing placeId or userId");

  const wishlistItem = await prisma.wishlistItem.findUnique({
    where: {
      placeId_userId: { placeId, userId }, // Uses the unique constraint
    },
  });

  return !!wishlistItem;
}



export async function getPostUser(userId: string) {
  if (!userId) throw new Error("User ID is required");

  try {
    const places = await prisma.place.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        name: true,
        caption: true,
        description: true,
        imageUrl: true,
        image: true,
        city: true,
        category: true,
        numVotes: true,
        createdAt: true,
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            likes: true,
            parentId: true,
            user: {
              select: {
                id: true,
                name: true,
                profileUrl: true,
                occupation: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            profileUrl: true,
            occupation: true,
          },
        },
      },
    });

    return places;
  } catch (error) {
    console.error("Error fetching places:", error);
    throw new Error("Failed to fetch places");
  }
}