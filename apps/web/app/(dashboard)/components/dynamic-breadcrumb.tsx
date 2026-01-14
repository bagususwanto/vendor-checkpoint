'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { navData, type NavItem } from '@/app/(dashboard)/config/nav-data';

/**
 * Recursive search to find the best matching path in the navigation tree.
 * Returns the sequence of items leading to the longest URL match.
 */
function findBreadcrumbPath(
  items: NavItem[],
  pathname: string,
  parents: NavItem[] = [],
): { items: NavItem[]; matchLength: number } {
  let best = { items: [] as NavItem[], matchLength: 0 };

  for (const item of items) {
    const currentPath = [...parents, item];
    let currentMatchLength = 0;

    // Check if current item matches pathname prefix
    if (item.url && item.url !== '#' && pathname.startsWith(item.url)) {
      // Ensure exact match or segment boundary (e.g., /foo matches /foo/bar but not /foobar)
      if (
        pathname.length === item.url.length ||
        pathname[item.url.length] === '/'
      ) {
        currentMatchLength = item.url.length;
      }
    }

    // Update best match if this item is better
    if (currentMatchLength > best.matchLength) {
      best = { items: currentPath, matchLength: currentMatchLength };
    }

    // Recurse into children
    if (item.items) {
      const childResult = findBreadcrumbPath(item.items, pathname, currentPath);
      if (childResult.matchLength > best.matchLength) {
        best = childResult;
      }
    }
  }

  return best;
}

/**
 * Helper to titleize URL segments (e.g., "my-page" -> "My Page")
 */
function titleize(slug: string) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

export function DynamicBreadcrumb() {
  const pathname = usePathname();

  const breadcrumbs = React.useMemo(() => {
    // 1. Find the best matching path from the menu configuration
    const { items: menuItems, matchLength } = findBreadcrumbPath(
      navData.navMain,
      pathname,
    );

    // 2. Handle the "dashboard" fallback or empty state
    // If absolutely nothing found, we will build from URL segments entirely.

    const resultItems: { title: string; url: string; isPage?: boolean }[] =
      menuItems.map((item) => ({
        title: item.title,
        url: item.url,
      }));

    // 3. Process remaining path segments (dynamic routes)
    if (matchLength < pathname.length) {
      const remainingPath = pathname.slice(matchLength);
      const segments = remainingPath.split('/').filter(Boolean);

      let currentUrl = pathname.slice(0, matchLength);

      segments.forEach((segment) => {
        // Handle slash accumulation
        currentUrl = currentUrl.endsWith('/')
          ? `${currentUrl}${segment}`
          : `${currentUrl}/${segment}`;

        resultItems.push({
          title: titleize(segment),
          url: currentUrl,
        });
      });
    }

    // 4. Fallback: If result is empty (e.g. root path "/" matching nothing), show Dashboard
    if (resultItems.length === 0) {
      return [{ title: 'Dashboard', url: '/', isPage: true }];
    }

    return resultItems;
  }, [pathname]);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const isPage = isLast || item.isPage;
          const isHash = item.url === '#';

          return (
            <React.Fragment key={index}>
              <BreadcrumbItem className="hidden md:block">
                {isPage || isHash ? (
                  <BreadcrumbPage>{item.title}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.url}>{item.title}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator className="hidden md:block" />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
