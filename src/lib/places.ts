import { prisma } from './db';

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

export async function addPlace(place: {
  name: string;
  description: string;
  state: string;
  city: string;
  category: string;
  imageUrl: string;
  userId: string;
}) {
  return prisma.place.create({
    data: place
  });
}

export async function voteForPlace(placeId: string, userId: string) {
  return prisma.vote.create({
    data: {
      placeId,
      userId
    }
  });
}