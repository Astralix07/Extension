import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, LogOut } from 'lucide-react';
import { cookies } from 'next/headers';
import { logout } from '@/lib/actions';

export function Header() {
  const session = cookies().get('session')?.value;
  const isLoggedIn = session === 'admin-logged-in';

  return (
    <header className="sticky top-6 z-50 flex justify-center w-full">
      <div className="w-full max-w-2xl flex h-14 items-center justify-between px-4" style={{ backgroundColor: '#BA55D3' }}>
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold" style={{ color: 'red' }}>
            KNULL
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
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
          {isLoggedIn && (
            <form action={logout}>
              <Button variant="ghost" className="transition-colors hover:text-white text-gray-200 p-0 h-auto">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </form>
          )}
        </nav>

        <div className="md:hidden">
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
                {isLoggedIn && (
                   <form action={logout}>
                     <Button variant="ghost" className="text-lg font-medium w-full justify-start p-0 h-auto">
                       <LogOut className="mr-2 h-5 w-5" />
                       Logout
                     </Button>
                   </form>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
