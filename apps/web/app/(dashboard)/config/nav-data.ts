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
      title: 'Dashboard',
      url: '#',
      icon: LayoutDashboard,
      items: [
        {
          title: 'Leader Dashboard',
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
          title: 'Staff Dashboard',
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
      title: 'Operations',
      url: '#',
      icon: SquareChartGantt,
      items: [
        {
          title: 'Delivery Monitoring',
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
          title: 'Queue Management',
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
          title: 'Vendor Categories',
          url: '/portal/master-data/vendor-category',
          icon: Tags,
          roles: [
            UserRole.SUPER_ADMIN,
            UserRole.GROUP_HEAD,
            UserRole.LINE_HEAD,
          ],
        },
        {
          title: 'Vendor Schedules',
          url: '/portal/master-data/vendor-schedule',
          icon: Building2,
          roles: [
            UserRole.SUPER_ADMIN,
            UserRole.GROUP_HEAD,
            UserRole.LINE_HEAD,
          ],
        },
        {
          title: 'Checklist List',
          url: '/portal/master-data/checklist',
          icon: ClipboardCheck,
          roles: [
            UserRole.SUPER_ADMIN,
            UserRole.GROUP_HEAD,
            UserRole.LINE_HEAD,
          ],
        },
        {
          title: 'Delay Reasons',
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
      title: 'Reports',
      url: '#',
      icon: FileText,
      items: [
        {
          title: 'Export Reports',
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
          title: 'Export Logs',
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
      title: 'System',
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
          title: 'Settings',
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
