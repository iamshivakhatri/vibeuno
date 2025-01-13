import { ProfileHeader } from '@/components/profile/profile-header';
import { PlaceTabs } from '@/components/profile/place-tabs';
import { notFound } from 'next/navigation';
import { getProfileData, getUserById } from '@/actions/user';
import { currentUser } from '@clerk/nextjs/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function ProfilePage({ params }: { params: { id: string } }) {
  // Get the current Clerk user
  const user = await currentUser();

  console.log('this is the profile id', params.id);

  // Fetch profile user data
  const profileUser = await getUserById(params.id);

  console.log('this is the profile user', profileUser);

  // Handle other non-200 responses
  if (profileUser.status !== 200 && profileUser.status !== 403) {
    notFound();
  }



  // Fetch profile data for valid users
  const userId = profileUser.user?.id;
  const profileData = await getProfileData(userId!);

  // Convert null values to undefined for optional properties
  profileData.location = profileData.location ?? null;
  profileData.university = profileData.university ?? null;
  profileData.occupation = profileData.occupation ?? null;
  

  // Determine if the current user is viewing their own profile
  const isCurrentUser = user?.id === profileData.clerkId;

  return (
    <div className="min-h-screen bg-background">
      {/* Profile Header */}
      <ProfileHeader user={profileData} isCurrentUser={isCurrentUser} />

      {/* Place Tabs */}
      <div className="container py-8">
        <PlaceTabs userId={profileData.id} />
      </div>

      {/* Show login prompt if user is not authenticated or not viewing their own profile */}
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
    </div>
  );
}
