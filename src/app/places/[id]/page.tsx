import { getPlaceById, getPlaceVisitors } from '@/actions/place';
import { PlaceDetail } from '@/components/places/place-detail';
import { currentUser } from '@clerk/nextjs/server'
import {  getUserById } from '@/actions/user';
import { redirect } from 'next/navigation'
import { notFound } from 'next/navigation';




export default async function PlaceDetailPage({ params }: { params: { id: string } }) {
  const placeData = await getPlaceById(params.id);
  const user = await currentUser();
  const clerkId = user?.id;

  const userId = placeData?.user?.id;

  const profileUser = await getUserById(userId);
  if (profileUser.status === 403) {
    redirect('/sign-in');
    
  }

  if (profileUser.status !== 200) {
    notFound();
  }
  
  console.log('userId at place:', userId);
  console.log('profileUser:', profileUser.user?.clerkId);
  console.log('clerkId of the loggedin user:', clerkId);
   const isCurrentUser = profileUser.user?.clerkId === clerkId;
      console.log('isCurrentUser at the server side:', isCurrentUser);


  const place = { 
    ...placeData, 
    name: placeData.name || '', 
    description: placeData.description || '', 
    image: Array.isArray(placeData.image) ? placeData.image as string[] : [], 

  };
  const visitors = await getPlaceVisitors(params.id);


  
  return <PlaceDetail place={place} visitors={visitors} userId={userId} isCurrentUser={isCurrentUser} />;
} 