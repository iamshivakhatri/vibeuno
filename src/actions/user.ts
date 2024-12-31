"use server"
import { prisma } from '@/lib/db';

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
