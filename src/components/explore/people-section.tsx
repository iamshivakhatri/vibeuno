"use client";

import { useState, useEffect } from "react";
import { getUsers } from "@/actions/user";
import { ChevronRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import Image from "next/image";

type User = {
  id: string;
  name: string | null;
  profileUrl: string | null;
  coverPhotoUrl: string | null;
};

export function PeopleSection() {
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loadUsers = async () => {
      const data = await getUsers();
      setUsers(data);
    };
    loadUsers();
  }, []);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          <h4 className="text-2xl font-bold">People You May Know</h4>
        </div>
        <Button
          variant="ghost"
          onClick={() => router.push('/explore/people')}
          className="flex items-center gap-2"
        >
          View All
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {users.slice(0, 9).map((user) => (
          <div
            key={user.id}
            className="group relative flex flex-col rounded-xl border bg-card overflow-hidden cursor-pointer"
            onClick={() => router.push(`/profile/${user.id}`)}
          >
            {user.coverPhotoUrl && (
              <div className="relative h-24 w-full">
                <Image
                  src={user.coverPhotoUrl}
                  alt={`${user.name}'s cover`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/30" />
              </div>
            )}
            <div className={`flex flex-col items-center ${user.coverPhotoUrl ? '-mt-10' : 'pt-6'} p-6`}>
              <Avatar className="h-20 w-20 mb-4 ring-4 ring-background">
                <AvatarImage src={user.profileUrl || ""} />
                <AvatarFallback>{user.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-semibold text-center">{user.name}</h3>
            </div>
          </div>
        ))}
      </div>


    </section>
  );
}