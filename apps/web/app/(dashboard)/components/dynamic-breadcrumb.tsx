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
import { navData, type NavItem } from '@/app/(dashboard)/config/nav-data';

function findBreadcrumbs(
  items: NavItem[],
  path: string,
): { title: string; url: string }[] {
  for (const item of items) {
    if (item.url === path) {
      return [{ title: item.title, url: item.url }];
    }
    if (item.items) {
      const children = findBreadcrumbs(item.items, path);
      if (children.length > 0) {
        return [{ title: item.title, url: item.url }, ...children];
      }
    }
  }
  return [];
}

export function DynamicBreadcrumb() {
  const pathname = usePathname();
  const breadcrumbs = findBreadcrumbs(navData.navMain, pathname);

  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;
          return (
            <span key={item.url} className="flex items-center gap-2">
              <BreadcrumbItem className="hidden md:block">
                {isLast ? (
                  <BreadcrumbPage>{item.title}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={item.url}>{item.title}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator className="hidden md:block" />}
            </span>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
