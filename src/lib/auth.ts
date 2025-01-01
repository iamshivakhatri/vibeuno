import { createContext, useContext } from 'react';
import { useUser } from '@clerk/nextjs';

// Define the user type
export type User = {
  id: string;
  email: string;
  name?: string;
};

type AuthContextType = {
  user: User | null;
  login: () => void; // Placeholder; login handled by Clerk's <SignInButton>
  logout: () => void; // Placeholder; logout handled by Clerk's <UserButton>
};

// Create the context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {}, // Clerk handles login via its components
  logout: () => {}, // Clerk handles logout via its components
});

// Hook to use the AuthContext
export const useAuth = () => {
  const { user, isSignedIn } = useUser();

  const authUser = isSignedIn
    ? {
        id: user?.id || '',
        email: user?.primaryEmailAddress?.emailAddress || '',
        name: user?.fullName || '',
      }
    : null;

  const login = () => {
    console.log('Use Clerk components like <SignInButton> for login.');
  };

  const logout = () => {
    console.log('Use Clerk components like <UserButton> for logout.');
  };

  return {
    user: authUser,
    login,
    logout,
  };
};
