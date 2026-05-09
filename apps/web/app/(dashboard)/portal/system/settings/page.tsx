'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Users, Building2, Loader2 } from 'lucide-react';
import { useSyncVendors } from '@/hooks/api/use-vendors';
import { useSyncUsers } from '@/hooks/api/use-users';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SystemConfigList } from './_components/system-config-list';
import { VerificationModeControl } from './_components/verification-mode-control';
import { AiApdControl } from './_components/ai-apd-control';
import { RoleGuard } from '@/components/auth/role-guard';
import { UserRole } from '@repo/types';

export default function SettingsPage() {
  const { mutate: syncVendors, isPending: isSyncingVendors } = useSyncVendors();
  const { mutate: syncUsers, isPending: isSyncingUsers } = useSyncUsers();

  return (
    <RoleGuard
      allowedRoles={[
        UserRole.SUPER_ADMIN,
        UserRole.GROUP_HEAD,
        UserRole.LINE_HEAD,
      ]}
    >
      <div className="flex flex-1 flex-col gap-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              System Settings
            </h2>
            <p className="text-muted-foreground text-sm">
              Manage system configuration and synchronization
            </p>
          </div>
        </div>

        <Tabs defaultValue="sync" className="space-y-4">
          <TabsList>
            <TabsTrigger value="sync">Synchronization</TabsTrigger>
            <TabsTrigger value="config">System Configuration</TabsTrigger>
          </TabsList>

          <TabsContent value="sync" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Sync Vendors */}
              <Card className="flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2 text-primary">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle>Vendor Synchronization</CardTitle>
                      <CardDescription>
                        Sync vendor data from external system
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    Sync latest vendor data from the external system. Vendor data
                    is used for check-in and verification processes.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => syncVendors()}
                    disabled={isSyncingVendors}
                    className="w-full"
                  >
                    {isSyncingVendors ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Syncing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Sync Vendors
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>

              {/* Sync Users */}
              <Card className="flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-status-info-bg p-2 text-status-info-fg">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle>User Synchronization</CardTitle>
                      <CardDescription>
                        Sync user data from external system
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    Sync latest user data from the external system. User data is
                    used for system authentication and authorization.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => syncUsers()}
                    disabled={isSyncingUsers}
                    className="w-full"
                    variant="outline"
                  >
                    {isSyncingUsers ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Syncing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Sync Users
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="config" className="space-y-4">
            <VerificationModeControl />
            <AiApdControl />
            <Card>
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
                <CardDescription>
                  List of system configuration variables. Change only if you
                  know the impact.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SystemConfigList />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </RoleGuard>
  );
}
