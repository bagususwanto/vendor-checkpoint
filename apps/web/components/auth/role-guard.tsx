'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/api/use-auth';
import { UserRole } from '@repo/types';
import { Loader2 } from 'lucide-react';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallbackPath?: string;
}

export function RoleGuard({
  children,
  allowedRoles,
  fallbackPath = '/portal/dashboard',
}: RoleGuardProps) {
  const router = useRouter();
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && (!user || !user.role || !allowedRoles.includes(user.role as UserRole))) {
      router.replace(fallbackPath);
    }
  }, [user, isLoading, allowedRoles, router, fallbackPath]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Memverifikasi akses...</p>
        </div>
      </div>
    );
  }

  if (!user || !user.role || !allowedRoles.includes(user.role as UserRole)) {
    return null; // or show access denied message
  }

  return <>{children}</>;
}
