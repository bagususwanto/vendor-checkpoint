import {
  LayoutDashboard,
  SquareChartGantt,
  Building2,
  Tags,
  ClipboardCheck,
  Settings,
  History,
  FileText,
  type LucideIcon,
} from 'lucide-react';
import { UserRole } from '@repo/types';

export interface NavItem {
  title: string;
  url: string; // Used for link if it's a child, ignored if it's a group header
  icon?: LucideIcon;
  isActive?: boolean;
  roles?: UserRole[];
  items?: NavItem[]; // Children
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
      items: [
        {
          title: 'Dasbor Leader',
          url: '/portal/dashboard/leader',
          icon: LayoutDashboard,
          roles: [UserRole.SUPER_ADMIN, UserRole.GROUP_LEADER],
        },
        {
          title: 'Dasbor Petugas',
          url: '/portal/dashboard/staff',
          icon: LayoutDashboard,
          roles: [UserRole.SUPER_ADMIN, UserRole.WAREHOUSE_STAFF],
        },
      ],
    },
    {
      title: 'Operasional',
      url: '#',
      icon: SquareChartGantt,
      items: [
        {
          title: 'Manajemen Antrean',
          url: '/portal/operational/queue',
          icon: SquareChartGantt,
          roles: [
            UserRole.SUPER_ADMIN,
            UserRole.WAREHOUSE_STAFF,
            UserRole.GROUP_LEADER,
          ],
        },
      ],
    },
    {
      title: 'Master Data',
      url: '#',
      icon: Building2,
      items: [
        {
          title: 'Daftar Vendor',
          url: '/portal/master-data/vendor-list',
          icon: Building2,
          roles: [UserRole.SUPER_ADMIN],
        },
        {
          title: 'Kategori Vendor',
          url: '/portal/master-data/vendor-category',
          icon: Tags,
          roles: [UserRole.SUPER_ADMIN],
        },
        {
          title: 'Daftar Pemeriksaan',
          url: '/portal/master-data/inspection-list',
          icon: ClipboardCheck,
          roles: [UserRole.SUPER_ADMIN],
        },
      ],
    },
    {
      title: 'Laporan',
      url: '#',
      icon: FileText,
      items: [
        {
          title: 'Export Laporan',
          url: '/portal/reports',
          icon: FileText,
          roles: [UserRole.SUPER_ADMIN],
        },
      ],
    },
    {
      title: 'Sistem',
      url: '#',
      icon: Settings,
      items: [
        {
          title: 'Audit Log',
          url: '/portal/master-data/audit-log',
          icon: History,
          roles: [UserRole.SUPER_ADMIN],
        },
        {
          title: 'Pengaturan',
          url: '/portal/master-data/settings',
          icon: Settings,
          roles: [UserRole.SUPER_ADMIN],
        },
      ],
    },
  ],
};
