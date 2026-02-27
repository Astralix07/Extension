'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import nProgress from 'nprogress';
import 'nprogress/nprogress.css';

export function PageProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    nProgress.configure({ showSpinner: false, speed: 500 });
  }, []);

  useEffect(() => {
    nProgress.start();
    const timer = setTimeout(() => {
      nProgress.done();
    }, 300);
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return null;
}
