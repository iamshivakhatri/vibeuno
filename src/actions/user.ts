"use server"
import { prisma } from '@/lib/db';
import { currentUser } from "@clerk/nextjs/server";



export async function getContributor() {
  try {
    // Fetch the contributors from the database
    const contributors = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        _count: {
          select: {
            places: true,
            votes: true,
          },
        },
      },
      orderBy: {
        places: {
          _count: 'desc',
        },
      },
      take: 10,
    });

    // Map the contributors and calculate points
    const topContributors = contributors.map(contributor => ({
      id: contributor.id,
      name: contributor.name || contributor.email.split('@')[0],
      points: (contributor._count.places * 10) + (contributor._count.votes * 2),
    }));

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
    console.log('User:', user);

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
      console.log('User exists:', userExist);
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
      
      },
    });

    console.log('New user:', newUser);

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