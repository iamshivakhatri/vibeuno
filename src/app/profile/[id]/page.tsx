import { ProfileHeader } from '@/components/profile/profile-header';
import { PlaceTabs } from '@/components/profile/place-tabs';
import { notFound } from 'next/navigation';
import { getProfileData, getUserById } from '@/actions/user';

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const user = await getUserById(params.id);
  console.log('User:', user);
  if (user.status !== 200) {
    notFound();
  }
  const userId = user.user?.id;

  const profileData = await getProfileData(userId!);

  return (
    <div className="min-h-screen bg-background">
      <ProfileHeader user={profileData} />
      
      <div className="container py-8">
        <PlaceTabs userId={profileData.id} />
      </div>
    </div>
  );
}

