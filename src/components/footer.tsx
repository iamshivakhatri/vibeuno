import Link from 'next/link';
import { MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="flex flex-col space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <MapPin className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">TravelVote</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Discover and share the best places to visit across states and cities.
            </p>
          </div>
          
          <div>
            <h3 className="mb-4 text-sm font-semibold">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/states" className="text-muted-foreground hover:text-primary">States</Link></li>
              <li><Link href="/cities" className="text-muted-foreground hover:text-primary">Cities</Link></li>
              <li><Link href="/top-places" className="text-muted-foreground hover:text-primary">Top Places</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 text-sm font-semibold">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-muted-foreground hover:text-primary">About</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary">Contact</Link></li>
              <li><Link href="/careers" className="text-muted-foreground hover:text-primary">Careers</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 text-sm font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-primary">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} TravelVote. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}