import { getPlaceById, getPlaceVisitors } from '@/actions/place';
import { PlaceDetail } from '@/components/places/place-detail';
import { currentUser } from '@clerk/nextjs/server'
import {  getUserById } from '@/actions/user';
import { redirect } from 'next/navigation'
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';




export default async function PlaceDetailPage({ params }: { params: { id: string } }) {
  const placeData = await getPlaceById(params.id);
  const user = await currentUser();
  const clerkId = user?.id;

  const userId = placeData?.user?.id;

  const profileUser = await getUserById(userId);
  // if (profileUser.status === 403) {
  //   redirect('/sign-in');
    
  // }

  if (profileUser.status !== 200 && profileUser.status !== 403) {
    notFound();
  }
  

   const isCurrentUser = profileUser.user?.clerkId === clerkId;


  const place = { 
    ...placeData, 
    name: placeData.name || '', 
    description: placeData.description || '', 
    image: Array.isArray(placeData.image) ? placeData.image as string[] : [], 

  };
  const visitors = await getPlaceVisitors(params.id);


  
  return (
    <>
  <PlaceDetail place={place} visitors={visitors} userId={userId} isCurrentUser={isCurrentUser} />
  {profileUser.status === 403 && (
    <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg">
      <div className="container flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Want to see more? Join Vibeuno today!
        </p>
        <Link href="/sign-in">
          <Button>Sign Up / Log In</Button>
        </Link>
      </div>
    </div>
  )}
      </>

);
} 