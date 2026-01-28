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

export default function SettingsPage() {
  const { mutate: syncVendors, isPending: isSyncingVendors } = useSyncVendors();
  const { mutate: syncUsers, isPending: isSyncingUsers } = useSyncUsers();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Pengaturan Sistem
          </h2>
          <p className="text-muted-foreground text-sm">
            Kelola konfigurasi dan sinkronisasi sistem
          </p>
        </div>
      </div>

      <Tabs defaultValue="sync" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sync">Sinkronisasi</TabsTrigger>
          <TabsTrigger value="config">Konfigurasi Sistem</TabsTrigger>
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
                    <CardTitle>Sinkronisasi Vendor</CardTitle>
                    <CardDescription>
                      Sync data vendor dari sistem eksternal
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground">
                  Sinkronkan data vendor terbaru dari sistem eksternal. Data
                  vendor digunakan untuk proses check-in dan verifikasi.
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
                      Sync Vendor
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>

            {/* Sync Users */}
            <Card className="flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle>Sinkronisasi User</CardTitle>
                    <CardDescription>
                      Sync data user dari sistem eksternal
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground">
                  Sinkronkan data user terbaru dari sistem eksternal. Data user
                  digunakan untuk autentikasi dan otorisasi sistem.
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
                      Sync User
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Konfigurasi Sistem</CardTitle>
              <CardDescription>
                Daftar konfigurasi variabel sistem. Ubah hanya jika Anda tahu
                dampaknya.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SystemConfigList />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
