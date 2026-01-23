'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Users, Building2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { axiosInstance } from '@/lib/axios';

export default function SettingsPage() {
  const [isSyncingVendors, setIsSyncingVendors] = useState(false);
  const [isSyncingUsers, setIsSyncingUsers] = useState(false);

  const handleSyncVendors = async () => {
    setIsSyncingVendors(true);
    try {
      const response = await axiosInstance.post<{
        created: number;
        updated: number;
        total: number;
        syncTime: string;
      }>('/vendor/sync');

      toast.success('Sync Vendor Berhasil', {
        description: `${response.data.created} vendor baru, ${response.data.updated} diperbarui dari ${response.data.total} total data.`,
      });
    } catch (error: any) {
      toast.error('Gagal Sync Vendor', {
        description:
          error.response?.data?.message ||
          'Terjadi kesalahan saat sync vendor.',
      });
    } finally {
      setIsSyncingVendors(false);
    }
  };

  const handleSyncUsers = async () => {
    setIsSyncingUsers(true);
    try {
      // TODO: Implement user sync endpoint when ready
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success('Sync User Berhasil', {
        description: 'Data user berhasil disinkronisasi dari sistem eksternal.',
      });
    } catch (error: any) {
      toast.error('Gagal Sync User', {
        description:
          error.response?.data?.message || 'Terjadi kesalahan saat sync user.',
      });
    } finally {
      setIsSyncingUsers(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Pengaturan Sistem
          </h2>
          <p className="text-muted-foreground text-sm">
            Kelola sinkronisasi data dengan sistem eksternal
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Sync Vendors */}
        <Card>
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
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Sinkronkan data vendor terbaru dari sistem eksternal. Data vendor
              digunakan untuk proses check-in dan verifikasi.
            </p>
            <Button
              onClick={handleSyncVendors}
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
          </CardContent>
        </Card>

        {/* Sync Users */}
        <Card>
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
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Sinkronkan data user terbaru dari sistem eksternal. Data user
              digunakan untuk autentikasi dan otorisasi sistem.
            </p>
            <Button
              onClick={handleSyncUsers}
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
            <p className="text-xs text-muted-foreground mt-2 italic">
              * Endpoint user sync belum diimplementasikan
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
