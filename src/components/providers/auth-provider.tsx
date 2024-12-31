'use client';

import { AuthContext } from '@/lib/auth';
import { useState } from 'react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ id: string; email: string } | null>({
    id: 'demo-user',
    email: 'demo@example.com',
  });

  const login = (email: string) => {
    setUser({ id: 'demo-user', email });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}