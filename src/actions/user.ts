"use server"
import { prisma } from '@/lib/db';
import { currentUser } from "@clerk/nextjs/server";
import { createDropdownMenuScope } from '@radix-ui/react-dropdown-menu';
import axios from 'axios';


export async function uploadProfilePicture(file: File, userId: string): Promise<string> {
  try {
    // Step 1: Get a pre-signed URL from your server
    const response = await axios.post('/api/aws', {
      fileType: file.type,
      userId,
    });
    
    // Access the `imageUrl` from the response
    const imageUrl = response.data.imageUrl;

    // Step 2: Upload the imageUrl to databse.
    await prisma.user.update({
      where: { clerkId: userId },
      data: {
        profileUrl: imageUrl,
      },
    });

    return imageUrl;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to upload profile picture');
  }
}



export async function getContributor() {
  try {
    // Fetch the contributors from the database
    const contributors = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        profileUrl: true,
        _count: {
          select: {
            places: true,
            votedPlaces: true,
          },
        },
      },
      orderBy: {
        places: {
          _count: 'desc',
        },
      },
      take: 50,
    });


    // Map the contributors and calculate points
      const topContributors = contributors
    .map(contributor => ({
      id: contributor.id,
      name: contributor.name || contributor.email.split('@')[0],
      profileUrl: contributor.profileUrl,
      points: (contributor._count.places * 5) + (contributor._count.votedPlaces * 3),
    }))
    .sort((a, b) => b.points - a.points); // Sort by points in descending order



    return topContributors; // Return the result as an array
  } catch (error) {
    console.error('Error loading top contributors:', error);
    throw new Error('Error loading top contributors'); // Throw an error to be handled in the calling function
  }
}

export const onAuthenticatedUser = async () => {
  try {
    // Get the authenticated user details
    const user = await currentUser();

    if (!user) {
      return { status: 403, message: 'User not authenticated' };
    }

    // Check if the user already exists in the database by email
    const userExist = await prisma.user.findUnique({
      where: {
        email: user.emailAddresses[0]?.emailAddress, // Ensure the email exists
      },
    });



    

    // If the user exists, return the user
    if (userExist) {
      return { status: 200, user: userExist };
    }

    // If the user does not exist, create a new user

    
    const email = user.emailAddresses[0]?.emailAddress;
    const name = `${user.firstName} ${user.lastName}`.trim() || null;

    // If email or name is missing, return a 400 error
    if (!email) {
      return { status: 400, message: 'Email address is required' };
    }



    // Create a new user in the database
    const newUser = await prisma.user.create({
      data: {
        email: email,
        name: name,
        clerkId: user.id,
        profileUrl: user.imageUrl || null,
      
      },
    });


    
    if (newUser) {
      return { status: 200, user: newUser };
    }


    // In case user creation fails, return a 500 error
    return { status: 500, message: 'Failed to create user' };
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error in onAuthenticatedUser:', error);

    // Return a 500 status in case of an unexpected error
    return { status: 500, message: 'An unexpected error occurred' };
  }
};


export const getUserById = async (userId: string) => {
  try {

    // first check if the user is authenticated
    


    // Fetch the user from the database
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
        // clerkId: checkUser.id,
      },
    });

    const checkUser = await currentUser();
    if (!checkUser) {
      return { status: 403, user };
    }
    
    if (!user) {
      return { status: 404, message: 'User not found' };
    }

    return { status: 200, user };
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return { status: 500, message: 'Failed to fetch user' };
  }
}

export const getShareUserById = async (userId: string) => {
  try {

    // first check if the user is authenticated
   


    // Fetch the user from the database
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
        // clerkId: checkUser.id,
      },
    });


    if (!user) {
      return { status: 404, message: 'User not found' };
    }

    return { status: 200, user };
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return { status: 500, message: 'Failed to fetch user' };
  }
}





/**
 * Fetches user profile data including their places and votes.
 * @param userId - The ID of the user to fetch data for.
 * @returns User profile data including places and votes.
 * @throws Error if the user is not found.
 */
// export async function getProfileData(userId: string) {
//   try {
//     // Fetch user data
//     const user = await prisma.user.findUnique({
//       where: { id: userId },
//       include: {
//         places: true, // Include places created by the user
//         votes: {
//           include: {
//             place: true, // Include details about places the user voted for
//           },
//         },
//       },
//     });

//     if (!user) {
//       throw new Error('User not found');
//     }

//     // Format and return the data
//     return {
//       id: user.id,
//       clerkId: user.clerkId,
//       email: user.email,
//       name: user.name,
//       createdAt: user.createdAt,
//       places: user.places.map((place) => ({
//         id: place.id,
//         name: place.name,
//         description: place.description,
//         state: place.state,
//         city: place.city,
//         category: place.category,
//         imageUrl: place.imageUrl,
//         createdAt: place.createdAt,
//         updatedAt: place.updatedAt,
//       })),
//       votes: user.votes.map((vote) => ({
//         id: vote.id,
//         placeId: vote.placeId,
//         createdAt: vote.createdAt,
//         place: {
//           id: vote.place.id,
//           name: vote.place.name,
//           description: vote.place.description,
//           state: vote.place.state,
//           city: vote.place.city,
//           category: vote.place.category,
//           imageUrl: vote.place.imageUrl,
//         },
//       })),
//     };
//   } catch (error) {
//     console.error('Error fetching profile data:', error);
//     throw new Error('Unable to fetch profile data');
//   }
// }

export async function getProfileData(userId: string) {
  try {
    // Fetch user data with counts for places and votes
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        places: true, // Fetch places to count them
        votedPlaces: true,  // Fetch votes to count them
      },
    });

    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

       // Calculate points
      const upvotePoints = user.votedPlaces.length * 3; // Each upvote gives 3 points
      const placePoints = user.places.length * 5;  // Each place gives 5 points
      const totalPoints = upvotePoints + placePoints;

    return {
      id: user.id,
      clerkId: user.clerkId || null,
      email: user.email,
      name: user.name || 'Anonymous',
      university: user.university,
      location: user.location,
      occupation: user.occupation, 
      interests: user.interests,
      createdAt: user.createdAt.toISOString(),
      placesCount: user.places.length, // Count of places created by the user
      votesCount: user.votedPlaces.length,  // Count of votes made by the user
      totalPoints,  // Total points calculated
      profileUrl: user.profileUrl || null,
      coverPhotoUrl: user.coverPhotoUrl || null,

    };
  } catch (error) {
    console.error('Error fetching profile data:', error);
    throw new Error('Unable to fetch profile data');
  }
}


export async function getProfileUrl(userId: string) {
  try{
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });
    return { profileUrl: user?.profileUrl };

  }catch(error){
    console.error('Error fetching profile url:', error);
    throw new Error('Unable to fetch profile url');
  }
 
}

export async function getProfileFromClerk(userId: string) {
  console.log("this is the userId at getprofilefromclerk", userId)
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        profileUrl: true,
        id: true,
      },
    });

    console.log("this is the user at getprofilefromclerk", user)

    if (!user) {
      throw new Error('User not found');
    }

    return { profileUrl: user.profileUrl, userId: user.id };
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw new Error('Unable to fetch profile');
  }
}



export async function hasUserVotedForPlace(placeId: string, userId: string) {

  console.log("this is the placeId", placeId)
  console.log("this is the userId", userId)
  // here userId is the clerkId
  try {
    const user = await prisma.user.findUnique({
      where:{
        id: userId
      }
    })

    if (!user){
       return 
    }
    
    const vote = await prisma.vote.findFirst({
      where: {
        placeId,
        userId: user?.id,
      },
    });

    const hasVoted = await prisma.place.findUnique({
      where: { id: placeId },
      select: { votedUsers: { where: { id: user?.id } } },
    });

    console.log("this is the hasVoted", hasVoted)

     // Check if the user has voted for the place


    if (hasVoted?.votedUsers === null || hasVoted?.votedUsers === undefined || hasVoted?.votedUsers.length === 0) {
      return false;
    } else {
      return true;
    }

  } catch (error) {
    console.error('Error checking vote:', error);
    throw new Error('Failed to check vote status');
  }
} 


export async function getPlaceVoteCount(placeId: string) {
  try {
    // const count = await prisma.vote.count({
    //   where: { placeId }
    // });
    const count = await prisma.place.findUnique({
      where: { id: placeId },
      select: { numVotes: true }
    })

    return count?.numVotes || 0;
  } catch (error) {
    console.error('Error getting vote count:', error);
    throw new Error('Failed to get vote count');
  }
} 



// export async function migrateVotes(name: string) {
//   try {
//     console.log('Migrating votes...', name);
//     // Get all existing votes
//     console.log('Migrating votes...');
//     const votes = await prisma.vote.findMany();
//     console.log('Votes:', votes);

//     // Batch updates for efficiency
//     const updatePromises = votes.map((vote) =>
//       prisma.place.update({
//         where: { id: vote.placeId },
//         data: {
//           numVotes: { increment: 1 },
//           votedUsers: {
//             connect: { id: vote.userId },
//           },
//         },
//       })
//     );

//     // Execute all updates concurrently
//     await Promise.all(updatePromises);

//     // Delete all votes after migration
//     // await prisma.vote.deleteMany();

//     console.log('Migration completed');
//     return { success: true };
//   } catch (error) {
//     console.error('Migration failed:', error);
//     throw new Error('Migration failed');
//   }
// }


// Server-side function to update user information
export async function updateUserInfo(userId: string, key: string, value: string) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { [key]: value },
    });

    return user;
  } catch (error) {
    console.error("Error updating user info:", error);
    throw new Error("Failed to update user information");
  }
}

export async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        profileUrl: true,
        coverPhotoUrl: true,
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50 // Limit the number of users returned
    });

    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}