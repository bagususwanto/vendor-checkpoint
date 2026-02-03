import { AppSidebar } from '@/app/(dashboard)/components/app-sidebar';
import { DashboardHeader } from '@/app/(dashboard)/components/dashboard-header';
import { LandingFooter } from '@/app/components/landing-footer';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</main>
        <LandingFooter />
      </SidebarInset>
    </SidebarProvider>
  );
}
