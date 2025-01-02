'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState, useCallback } from 'react';
import { getAppUserId } from '@/actions/auth';

interface ClerkData {
  isSignedIn: boolean;
  isLoading: boolean;
  error: Error | null;
  clerkId: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  appUserId: string | null;
  user: ReturnType<typeof useUser>['user'];
}

export function useClerkData(): ClerkData {
  const { user, isSignedIn, isLoaded } = useUser();
  const [appUserId, setAppUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAppUserId = useCallback(async (clerkId: string) => {
    try {
      setIsLoading(true);
      const userId = await getAppUserId(clerkId);
      setAppUserId(userId);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch user ID'));
      setAppUserId(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && user?.id) {
      fetchAppUserId(user.id);
    } else {
      setAppUserId(null);
      setIsLoading(false);
    }
  }, [isSignedIn, user?.id, isLoaded, fetchAppUserId]);

  return {
    isSignedIn: Boolean(isSignedIn),
    isLoading: isLoading || !isLoaded,
    error,
    clerkId: user?.id ?? null,
    email: user?.emailAddresses[0]?.emailAddress ?? null,
    firstName: user?.firstName ?? null,
    lastName: user?.lastName ?? null,
    appUserId,
    user
  };
}