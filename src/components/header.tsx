import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-6 z-50 flex justify-center w-full">
      <div className="w-full max-w-2xl flex h-14 items-center px-4" style={{ backgroundColor: '#BA55D3' }}>
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block" style={{ color: 'red' }}>
              KNULL
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/"
              className="transition-colors hover:text-white text-gray-200"
            >
              Home
            </Link>
            <Link
              href="/admin"
              className="transition-colors hover:text-white text-gray-200"
            >
              Admin
            </Link>
          </nav>
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:hidden">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold" style={{ color: 'red' }}>
                KNULL
              </span>
            </Link>
        </div>

        <div className="flex flex-1 items-center justify-end md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 hover:text-white focus-visible:bg-white/20">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4 mt-8">
                <Link href="/" className="text-lg font-medium">
                  Home
                </Link>
                <Link href="/admin" className="text-lg font-medium">
                  Admin
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
