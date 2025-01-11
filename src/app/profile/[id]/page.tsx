import { ProfileHeader } from '@/components/profile/profile-header';
import { PlaceTabs } from '@/components/profile/place-tabs';
import { notFound } from 'next/navigation';
import { getProfileData, getUserById } from '@/actions/user';
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function ProfilePage({ params }: { params: { id: string } }) {
  // Get the current Clerk user
  const user = await currentUser();
 
  console.log('this is the profile id', params.id)
  
  const profileUser = await getUserById(params.id);
  if (profileUser.status === 403) {
    redirect('/sign-in');
    
  }

  if (profileUser.status !== 200) {
    notFound();
  }
  const userId = profileUser.user?.id;
  const profileData = await getProfileData(userId!);




  // Check if the current user is viewing their own profile
  const isCurrentUser = user?.id === profileData.clerkId;

  return (
    <div className="min-h-screen bg-background">
      <ProfileHeader user={profileData} isCurrentUser={isCurrentUser} />
      
      <div className="container py-8">
        <PlaceTabs userId={profileData.id}  />
      </div>
    </div>
  );
}

