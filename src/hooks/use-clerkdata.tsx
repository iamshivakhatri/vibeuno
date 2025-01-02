'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState, useCallback } from 'react';
import { getAppUserId } from '@/actions/auth';

export function useClerkData(): { appUserId: string | null } {
  const { user, isSignedIn, isLoaded } = useUser();
  const [appUserId, setAppUserId] = useState<string | null>(null);

  const fetchAppUserId = useCallback(async (clerkId: string) => {
    try {
      const userId = await getAppUserId(clerkId);
      setAppUserId(userId);
    } catch {
      setAppUserId(null);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && user?.id) {
      fetchAppUserId(user.id);
    } else {
      setAppUserId(null);
    }
  }, [isLoaded, isSignedIn, user?.id, fetchAppUserId]);

  return { appUserId };
}
