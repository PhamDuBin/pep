'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { VendorLayout } from '@/features/vendor/layout';

interface VendorLayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: VendorLayoutProps) {
  const pathname = usePathname();

  // Skip layout for auth pages (register, login)
  const isAuthPage = pathname?.includes('/register') || pathname?.includes('/login');

  if (isAuthPage) {
    return <>{children}</>;
  }

  return <VendorLayout>{children}</VendorLayout>;
}
