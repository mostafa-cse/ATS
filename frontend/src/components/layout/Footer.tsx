import Link from 'next/link';
import { Cpu, Link as LinkIcon, Globe, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-secondary/50 border-t border-border pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Cpu className="h-6 w-6 text-primary" />
              </div>
              <span className="font-bold text-xl tracking-tight text-foreground">
                Aesthetic Tech
              </span>
            </Link>
            <p className="text-muted-foreground text-sm">
              The premier destination for high-end PC components and smart electronics in Bangladesh. Build your dream setup.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Globe className="w-5 h-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><MessageCircle className="w-5 h-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><LinkIcon className="w-5 h-5" /></a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/categories" className="text-muted-foreground hover:text-primary transition-colors">All Categories</Link></li>
              <li><Link href="/products?category=Monitor" className="text-muted-foreground hover:text-primary transition-colors">Monitors</Link></li>
              <li><Link href="/products?category=Accessories" className="text-muted-foreground hover:text-primary transition-colors">Peripherals</Link></li>
              <li><Link href="/builder" className="text-muted-foreground hover:text-primary transition-colors">Smart PC Builder</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/support/warranty" className="text-muted-foreground hover:text-primary transition-colors">Warranty Policy</Link></li>
              <li><Link href="/support/returns" className="text-muted-foreground hover:text-primary transition-colors">Returns & Refunds</Link></li>
              <li><Link href="/support/shipping" className="text-muted-foreground hover:text-primary transition-colors">Shipping Information</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Newsletter</h3>
            <p className="text-muted-foreground text-sm mb-4">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
            <form className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <button 
                type="submit"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Subscribe
              </button>
            </form>
          </div>

        </div>
        
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Aesthetic Tech Store. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
