'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu';
import { Search, MapPin, Menu, X } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { useClerk } from '@clerk/nextjs';
import { getAppUserId } from '@/actions/auth';
import { useQuery } from '@tanstack/react-query';
import { getProfileUrl } from '@/actions/user';
import { usePathname } from 'next/navigation';


export function Navbar() {
  const { user, isSignedIn } = useUser();
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const { signOut } = useClerk();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Optimized profile URL query
  const { data: profileUrl } = useQuery({
    queryKey: ['profileUrl', user?.id],
    queryFn: () => getProfileUrl(user?.id ?? ''),
    enabled: !!isSignedIn && !!user?.id,
    initialData: user?.imageUrl, // Use Clerk's image URL as initial data
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // Optimized user ID query
  const { data: appUserId = "", isLoading, isError } = useQuery({
    queryKey: ['userId', user?.id],
    queryFn: () => getAppUserId(user?.id ?? ''),
    enabled: !!user?.id,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // Handle loading and error states
  if (isLoading) {
    return (
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <MapPin className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Vibeuno</span>
          </Link>
          {/* <NavigationMenu className={cn("hidden md:flex", )}> */}
          <NavigationMenu className={cn(
              "md:flex",
              {
                "hidden": isHomePage,
              }
            )}>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/explore" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      'group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50'
                    )}
                  >
                    Explore
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/upload" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      'group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50'
                    )}
                  >
                    Add Place
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            {/* Handle loading state */}
            <Button disabled>Loading...</Button>
          </div>
        </div>
      </header>
    );
  }

  if (isError) {
    return <div>Error fetching user data</div>;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <MapPin className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Vibeuno</span>
        </Link>

        {/* <NavigationMenu className="hidden md:flex"> */}
        <NavigationMenu className={cn({"md:flex": !isHomePage}, "hidden")}>

          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/explore" legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(
                    'group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50'
                  )}
                >
                  Explore 
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/upload" legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(
                    'group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50'
                  )}
                >
                  Add Place
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/plan" legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(
                    'group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50'
                  )}
                >
                  Plan Trip
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center space-x-4">
             {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
             {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="ml-0 absolute top-16  left-[-12px] w-full bg-white shadow-lg md:hidden">
          <ul className="flex flex-col space-y-2 p-4">
            <li>
              <Link href="/explore" legacyBehavior passHref>
                <a
                  className="block rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Explore
                </a>
              </Link>
            </li>
            <li>
              <Link href="/upload" legacyBehavior passHref>
                <a
                  className="block rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Add Place
                </a>
              </Link>
            </li>

            <li>
              <Link href="/plan" legacyBehavior passHref>
                <a
                  className="block rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Plan Trip
                </a>
              </Link>
            </li>
          </ul>
        </div>
      )}
          {/* <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button> */}

          {/* Custom Dropdown for Profile */}
          {isSignedIn ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center focus:outline-none"
              >
                <img
                  src={profileUrl || user?.imageUrl || '/default-avatar.png'}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                  loading="eager"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = user?.imageUrl || '/default-avatar.png';
                  }}
                />
              </button>

              {dropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50"
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <ul className="py-2 text-sm text-gray-700">
                    <li>
                      <Link href={`/profile/${appUserId}`} className="block px-4 py-2 hover:bg-gray-100">
                        Profile
                      </Link>
                    </li>
                    {/* <li>
                      <Link href="/settings" className="block px-4 py-2 hover:bg-gray-100">
                        Settings
                      </Link>
                    </li> */}
                    <li>
                      <button 
                        onClick={() => signOut({ redirectUrl: '/' })}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <Link href="/sign-in">
              <Button className="">
                <User className="mr-2" />
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
