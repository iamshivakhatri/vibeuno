import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Medal } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getContributor } from '@/actions/user';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export function TopContributors() {
  const router = useRouter();

  const { data: contributors, isLoading, error } = useQuery({
    queryKey: ['contributors'],
    queryFn: async () => await getContributor(),
  });

  const handleNavigate = (id: string) => {
    router.push(`/profile/${id}`);
  };

  if (isLoading) {
    return <div  className='h-10 flex align-center justify-center'>Loading contributors...</div>;
  }

  if (error) {
    return <div>{error instanceof Error ? error.message : 'Error loading contributors'}</div>;
  }

  return (
    <section className="py-16 bg-accent">
      <div className="container">
        <h2 className="text-3xl font-semibold text-center mb-12">Top Contributors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(contributors ?? []).map((contributor, index) => (
            <Card
              key={contributor.id}
              className="p-6 cursor-pointer hover:shadow-lg"
              onClick={() => handleNavigate(contributor.id)}
            >
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <Image
                    src={contributor.profileUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${contributor.id}`}
                    alt={contributor.name}
                    width={48}
                    height={48}
                  />
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{contributor.name}</h3>
                    {index < 3 && (
                      <Medal
                        className={`h-4 w-4 ${
                          index === 0
                            ? 'text-yellow-500'
                            : index === 1
                            ? 'text-gray-400'
                            : 'text-amber-600'
                        }`}
                      />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{contributor.points} points</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
