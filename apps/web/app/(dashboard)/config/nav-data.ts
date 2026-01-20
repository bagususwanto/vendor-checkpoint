import {
  LayoutDashboard,
  SquareChartGantt,
  type LucideIcon,
} from 'lucide-react';
import { UserRole } from '@repo/types';

export interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  roles?: UserRole[];
  items?: {
    title: string;
    url: string;
    roles?: UserRole[];
  }[];
}

export interface NavData {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  navMain: NavItem[];
}

export const navData: NavData = {
  user: {
    name: 'user',
    email: 'user@example.com',
    avatar: '',
  },
  navMain: [
    {
      title: 'Dasbor',
      url: '#',
      icon: LayoutDashboard,
      roles: [UserRole.SUPER_ADMIN],
      items: [
        {
          title: 'Dasbor Leader',
          url: '/portal/dashboard/leader',
          roles: [UserRole.SUPER_ADMIN],
        },
        {
          title: 'Dasbor Petugas',
          url: '/portal/dashboard/staff',
          roles: [UserRole.SUPER_ADMIN],
        },
      ],
    },
    {
      title: 'Dasbor',
      url: '/portal/dashboard/leader',
      icon: LayoutDashboard,
      roles: [UserRole.GROUP_LEADER],
      items: [],
    },
    {
      title: 'Dasbor',
      url: '/portal/dashboard/staff',
      icon: LayoutDashboard,
      roles: [UserRole.WAREHOUSE_STAFF],
      items: [],
    },
    {
      title: 'Manajemen Antrean',
      url: '/portal/queue',
      icon: SquareChartGantt,
      roles: [
        UserRole.SUPER_ADMIN,
        UserRole.WAREHOUSE_STAFF,
        UserRole.GROUP_LEADER,
      ],
      items: [],
    },
    {
      title: 'Manajemen Vendor',
      url: '#',
      icon: LayoutDashboard,
      roles: [UserRole.SUPER_ADMIN],
      items: [
        {
          title: 'Vendor List',
          url: '/portal/vendor/list',
          roles: [UserRole.SUPER_ADMIN],
        },
        {
          title: 'Kategori Vendor',
          url: '/portal/vendor/category',
          roles: [UserRole.SUPER_ADMIN],
        },
      ],
    },
    {
      title: 'Manajemen Pemeriksaan',
      url: '/portal/inspection/list',
      icon: LayoutDashboard,
      roles: [UserRole.SUPER_ADMIN],
      items: [],
    },
  ],
};
