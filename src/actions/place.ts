// actions/place.ts
"use server"

import { prisma } from "@/lib/db";

export async function addPlace(formData: {
  name: string;
  description: string;
  imageUrl: string;
  userId: string;
  state: string;
  city: string;
  category: string;
}) {
  try {
    console.log("Form Data:", formData); // Debugging: Log the form data

    const place = await prisma.place.create({
      data: formData
    });

    console.log("Place Created:", place); // Debugging: Log the created place

    return { success: true, data: place };
  } catch (error) {
    console.error('Error adding place:', error); // Log the error message
    return { success: false, error: error|| 'Failed to add place' };
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

export async function voteForPlace(placeId: string, userId: string) {
  return prisma.vote.create({
    data: {
      placeId,
      userId
    }
  });
}