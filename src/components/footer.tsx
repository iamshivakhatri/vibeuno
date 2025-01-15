import Link from 'next/link';
import { MapPin, Facebook, Twitter, Instagram, Send } from 'lucide-react';

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-background pt-16 pb-6 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary"></div>
      <div className="container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2 group">
              <MapPin className="h-6 w-6 text-primary group-hover:text-secondary transition-colors duration-300" />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-primary">TravelVote</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Discover and share the best places to visit across states and cities. Your adventure starts here!
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="mb-4 text-sm font-semibold">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="explore/people" className="text-muted-foreground hover:text-primary transition-colors duration-300">People</Link></li>
              <li><Link href="explore/cities" className="text-muted-foreground hover:text-primary transition-colors duration-300">Cities</Link></li>
              <li><Link href="explore/places" className="text-muted-foreground hover:text-primary transition-colors duration-300">Places</Link></li>
              {/* <li><Link href="/itineraries" className="text-muted-foreground hover:text-primary transition-colors duration-300">Itineraries</Link></li> */}
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 text-sm font-semibold">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors duration-300">About</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors duration-300">Contact</Link></li>
              {/* <li><Link href="/careers" className="text-muted-foreground hover:text-primary transition-colors duration-300">Careers</Link></li>
              <li><Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors duration-300">Blog</Link></li> */}
            </ul>
          </div>
          
          {/* <div>
            <h3 className="mb-4 text-sm font-semibold">Stay Connected</h3>
            <p className="text-sm text-muted-foreground mb-4">Subscribe to our newsletter for travel tips and exclusive offers.</p>
            <form className="flex space-x-2">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-grow"
              />
              <Button type="submit" size="sm">
                <Send size={16} className="mr-2" />
                Subscribe
              </Button>
            </form>
          </div> */}
        </div>
        
        <div className="border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Vibeuno. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-primary transition-colors duration-300">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors duration-300">Terms of Service</Link>
            <Link href="/sitemap" className="hover:text-primary transition-colors duration-300">Sitemap</Link>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 right-0 opacity-10 pointer-events-none">
        <MapPin size={300} />
      </div>
    </footer>
  );
}

