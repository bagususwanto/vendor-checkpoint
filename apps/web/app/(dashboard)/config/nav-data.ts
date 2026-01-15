import {
  LayoutDashboard,
  SquareChartGantt,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
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

// export const navData: NavData = {
//   user: {
//     name: 'shadcn',
//     email: 'm@example.com',
//     avatar: '',
//   },
//   navMain: [
//     {
//       title: 'Dasbor',
//       url: '#',
//       icon: LayoutDashboard,
//       items: [
//         {
//           title: 'Petugas Warehouse',
//           url: '/staff/dashboard',
//         },
//       ],
//     },
//     {
//       title: 'Manajemen Antrean',
//       url: '#',
//       icon: SquareChartGantt,
//       items: [
//         {
//           title: 'Semua Antrean',
//           url: '/staff/queue',
//         },
//       ],
//     },
//   ],
// };

export const navData: NavData = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '',
  },
  navMain: [
    {
      title: 'Dasbor',
      url: '/staff/dashboard',
      icon: LayoutDashboard,
      items: [],
    },
    {
      title: 'Manajemen Antrean',
      url: '/staff/queue',
      icon: SquareChartGantt,
      items: [],
    },
  ],
};
