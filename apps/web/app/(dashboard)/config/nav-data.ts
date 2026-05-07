import {
  LayoutDashboard,
  SquareChartGantt,
  Building2,
  Tags,
  ClipboardCheck,
  Settings,
  History,
  FileText,
  Users,
  TrendingUp,
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
          roles: [
            UserRole.SUPER_ADMIN,
            UserRole.GROUP_HEAD,
            UserRole.LINE_HEAD,
            UserRole.SECTION_HEAD,
          ],
        },
        {
          title: 'Dasbor Petugas',
          url: '/portal/dashboard/staff',
          icon: LayoutDashboard,
          roles: [
            UserRole.SUPER_ADMIN,
            UserRole.WAREHOUSE_STAFF,
            UserRole.WAREHOUSE_MEMBER,
          ],
        },
      ],
    },
    {
      title: 'Operasional',
      url: '#',
      icon: SquareChartGantt,
      items: [
        {
          title: 'Monitoring Pengiriman',
          url: '/portal/operational/delivery-slot',
          icon: SquareChartGantt,
          roles: [
            UserRole.SUPER_ADMIN,
            UserRole.GROUP_HEAD,
            UserRole.LINE_HEAD,
            UserRole.SECTION_HEAD,
            UserRole.WAREHOUSE_STAFF,
            UserRole.WAREHOUSE_MEMBER,
          ],
        },
        {
          title: 'Manajemen Antrean',
          url: '/portal/operational/queue',
          icon: SquareChartGantt,
          roles: [
            UserRole.SUPER_ADMIN,
            UserRole.WAREHOUSE_STAFF,
            UserRole.WAREHOUSE_MEMBER,
            UserRole.GROUP_HEAD,
            UserRole.LINE_HEAD,
            UserRole.SECTION_HEAD,
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
          title: 'Kategori Vendor',
          url: '/portal/master-data/vendor-category',
          icon: Tags,
          roles: [
            UserRole.SUPER_ADMIN,
            UserRole.GROUP_HEAD,
            UserRole.LINE_HEAD,
          ],
        },
        {
          title: 'Jadwal Vendor',
          url: '/portal/master-data/vendor-schedule',
          icon: Building2,
          roles: [
            UserRole.SUPER_ADMIN,
            UserRole.GROUP_HEAD,
            UserRole.LINE_HEAD,
          ],
        },
        {
          title: 'Daftar Pemeriksaan',
          url: '/portal/master-data/checklist',
          icon: ClipboardCheck,
          roles: [
            UserRole.SUPER_ADMIN,
            UserRole.GROUP_HEAD,
            UserRole.LINE_HEAD,
          ],
        },
        {
          title: 'Alasan Delay',
          url: '/portal/master-data/delay-reason',
          icon: ClipboardCheck,
          roles: [
            UserRole.SUPER_ADMIN,
            UserRole.GROUP_HEAD,
            UserRole.LINE_HEAD,
          ],
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
          url: '/portal/reports/export',
          icon: FileText,
          roles: [
            UserRole.SUPER_ADMIN,
            UserRole.GROUP_HEAD,
            UserRole.LINE_HEAD,
            UserRole.SECTION_HEAD,
          ],
        },
        {
          title: 'Export Log',
          url: '/portal/reports/log-export',
          icon: FileText, // Using same icon for now
          roles: [
            UserRole.SUPER_ADMIN,
            UserRole.GROUP_HEAD,
            UserRole.LINE_HEAD,
            UserRole.SECTION_HEAD,
          ],
        },
        {
          title: 'Vendor Performance',
          url: '/portal/reports/vendor-performance',
          icon: TrendingUp,
          roles: [
            UserRole.SUPER_ADMIN,
            UserRole.GROUP_HEAD,
            UserRole.LINE_HEAD,
            UserRole.SECTION_HEAD,
          ],
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
          url: '/portal/system/audit-log',
          icon: History,
          roles: [
            UserRole.SUPER_ADMIN,
            UserRole.GROUP_HEAD,
            UserRole.LINE_HEAD,
            UserRole.SECTION_HEAD,
          ],
        },
        {
          title: 'Pengaturan',
          url: '/portal/system/settings',
          icon: Settings,
          roles: [
            UserRole.SUPER_ADMIN,
            UserRole.GROUP_HEAD,
            UserRole.LINE_HEAD,
          ],
        },
      ],
    },
  ],
};
