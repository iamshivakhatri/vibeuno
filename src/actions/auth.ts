"use server"

import { prisma } from "@/lib/db";

export async function getAppUserId(clerkId: string) {
  try {
    console.log('Fetching userId for clerkId:', clerkId);
 

    const user = await prisma.user.findUnique({
        where: {
          clerkId: clerkId 
        },
      });
    console.log('User:', user);
    console.log('bunger and bun ger', user?.id);

    return user?.id ?? null;
  } catch (error) {
    console.error('Error fetching userId:', error);
    return null;
  }
}
