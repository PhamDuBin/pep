'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { BuyerLayout } from '@/features/buyer/layout';

interface BuyerLayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: BuyerLayoutProps) {
  const pathname = usePathname();

  // Skip layout for auth pages (register, login)
  const isAuthPage = pathname?.includes('/register') || pathname?.includes('/login');

  if (isAuthPage) {
    return <>{children}</>;
  }

  return <BuyerLayout>{children}</BuyerLayout>;
}
