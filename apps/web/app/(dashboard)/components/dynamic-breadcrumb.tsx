'use client';

import { usePathname } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { navData } from '@/app/(dashboard)/config/nav-data';

export function DynamicBreadcrumb() {
  const pathname = usePathname();

  // Find the active menu item based on current pathname
  const findActiveItem = () => {
    for (const navItem of navData.navMain) {
      const subItem = navItem.items?.find((item) => item.url === pathname);
      if (subItem) {
        return {
          parent: navItem,
          child: subItem,
        };
      }
    }
    return null;
  };

  const activeItem = findActiveItem();

  if (!activeItem) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href={activeItem.parent.url}>
            {activeItem.parent.title}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block" />
        <BreadcrumbItem>
          <BreadcrumbPage>{activeItem.child.title}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
