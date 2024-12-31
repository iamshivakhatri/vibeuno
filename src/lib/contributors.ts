import { prisma } from './db';

export async function getTopContributors() {
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

  return contributors.map(contributor => ({
    id: contributor.id,
    name: contributor.name || contributor.email.split('@')[0],
    points: (contributor._count.places * 10) + (contributor._count.votes * 2),
  }));
}