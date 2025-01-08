import { notFound } from 'next/navigation';
import { getProfileData, getShareUserById } from '@/actions/user';
import { SharedProfileHeader } from '@/components/profile/shared-profile-header';
import { SharedPlaceTabs } from '@/components/profile/shared-place-tabs';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function SharedProfilePage({ params }: { params: { id: string } }) {
  const user = await getShareUserById(params.id);
  if (user.status !== 200) {
    notFound();
  }
  const userId = user.user?.id;

  const profileData = await getProfileData(userId!);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-purple-50">
      <SharedProfileHeader user={profileData} />
      
      <div className="container py-8">
        <SharedPlaceTabs userId={profileData.id} />
      </div>

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
    </div>
  );
}
