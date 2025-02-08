import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db'; // Adjust the import based on your setup

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const page = url.searchParams.get('page') || '1'; // Default to page 1
    const limit = url.searchParams.get('limit') || '10'; // Default to 10 items per page
    const skip = (Number(page) - 1) * Number(limit);

    const places = await prisma.place.findMany({
      skip,
      take: Number(limit),
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
        createdAt: 'desc',
      },
    });

    return NextResponse.json(places);
  } catch (error) {
    console.error('Error fetching places:', error);
    return NextResponse.json(
      { error: 'Failed to fetch places' },
      { status: 500 }
    );
  }
}