'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Field,
  FieldLabel,
  FieldError,
  FieldContent,
} from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { VendorScheduleResponse, DayOfWeek, DAY_OPTIONS } from '@repo/types';
import { useCreateVendorSchedule, useUpdateVendorSchedule } from '@/hooks/api/use-vendor-schedule';
import { useVendorsPaginated } from '@/hooks/api/use-vendors';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  vendor_id: z.coerce.number().min(1, 'Pilih vendor terlebih dahulu'),
  day_of_week: z.nativeEnum(DayOfWeek),
  rit: z.coerce.number().min(1, 'Nit minimal 1'),
  arrival_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format waktu harus HH:mm'),
  departure_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format waktu harus HH:mm'),
  truck_station: z.string().optional().nullable(),
  is_active: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface ScheduleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schedule: VendorScheduleResponse | null;
}


export function ScheduleForm({
  open,
  onOpenChange,
  schedule,
}: ScheduleFormProps) {
  const createMutation = useCreateVendorSchedule();
  const updateMutation = useUpdateVendorSchedule();

  const isEditing = !!schedule;
  const isPending = createMutation.isPending || updateMutation.isPending;

  // Fetch all active vendors
  const { data: vendorsData, isLoading: isLoadingVendors } = useVendorsPaginated(
    {
      page: 1,
      limit: 1000,
      isActive: true,
    },
    { enabled: open }
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema as any) as any,
    defaultValues: {
      vendor_id: 0,
      day_of_week: 1,
      rit: 1,
      arrival_time: '08:00',
      departure_time: '17:00',
      truck_station: '',
      is_active: true,
    },
  });

  useEffect(() => {
    if (open) {
      if (schedule) {
        form.reset({
          vendor_id: schedule.vendor_id,
          day_of_week: schedule.day_of_week,
          rit: schedule.rit,
          arrival_time: schedule.arrival_time,
          departure_time: schedule.departure_time,
          truck_station: schedule.truck_station ?? '',
          is_active: schedule.is_active,
        });
      } else {
        form.reset({
          vendor_id: 0,
          day_of_week: 1,
          rit: 1,
          arrival_time: '08:00',
          departure_time: '17:00',
          truck_station: '',
          is_active: true,
        });
      }
    }
  }, [open, schedule, form]);

  const onSubmit = (values: FormValues) => {
    if (isEditing) {
      updateMutation.mutate(
        { id: schedule!.schedule_id, data: values },
        {
          onSuccess: () => {
            toast.success('Jadwal berhasil diperbarui');
            onOpenChange(false);
          },
          onError: (error: any) => {
            toast.error('Gagal memperbarui jadwal', {
              description: error.message || 'Terjadi kesalahan sistem',
            });
          },
        }
      );
    } else {
      createMutation.mutate(values, {
        onSuccess: () => {
          toast.success('Jadwal berhasil ditambahkan');
          onOpenChange(false);
        },
        onError: (error: any) => {
          toast.error('Gagal menambahkan jadwal', {
            description: error.message || 'Terjadi kesalahan sistem',
          });
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Jadwal Vendor' : 'Tambah Jadwal Vendor'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Pastikan slot waktu yang diperbarui tidak mengganggu jadwal yang sedang berjalan hari ini.'
              : 'Konfigurasi jadwal kunjungan rutin untuk vendor baru.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Field>
            <FieldLabel required>Pilih Vendor</FieldLabel>
            <FieldContent>
              <Controller
                control={form.control}
                name="vendor_id"
                render={({ field }) => (
                  <Select
                    disabled={isPending || isLoadingVendors}
                    onValueChange={(val) => field.onChange(Number(val))}
                    value={field.value ? field.value.toString() : ''}
                  >
                    <SelectTrigger>
                      {isLoadingVendors ? (
                        <div className="flex items-center">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memuat data...
                        </div>
                      ) : (
                        <SelectValue placeholder="Pilih Vendor dari daftar" />
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      {vendorsData?.data?.map((vendor) => (
                        <SelectItem key={vendor.vendor_id} value={vendor.vendor_id.toString()}>
                          {vendor.company_name} ({vendor.vendor_code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FieldContent>
            <FieldError errors={[form.formState.errors.vendor_id]} />
          </Field>

          <Field>
            <FieldLabel required>Hari Kedatangan</FieldLabel>
            <FieldContent>
              <Controller
                control={form.control}
                name="day_of_week"
                render={({ field }) => (
                  <Select
                    disabled={isPending}
                    onValueChange={(val) => field.onChange(Number(val))}
                    value={field.value?.toString()}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Hari" />
                    </SelectTrigger>
                    <SelectContent>
                      {DAY_OPTIONS.map((day) => (
                        <SelectItem key={day.value} value={day.value.toString()}>
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FieldContent>
            <FieldError errors={[form.formState.errors.day_of_week]} />
          </Field>

          <Field>
            <FieldLabel required>Rit (Nomor Trip)</FieldLabel>
            <FieldContent>
              <Input type="number" min={1} placeholder="1" {...form.register('rit')} />
            </FieldContent>
            <FieldError errors={[form.formState.errors.rit]} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel required>Waktu Tiba</FieldLabel>
              <FieldContent>
                <Input type="time" placeholder="HH:mm" {...form.register('arrival_time')} />
              </FieldContent>
              <FieldError errors={[form.formState.errors.arrival_time]} />
            </Field>

            <Field>
              <FieldLabel required>Waktu Pulang</FieldLabel>
              <FieldContent>
                <Input type="time" placeholder="HH:mm" {...form.register('departure_time')} />
              </FieldContent>
              <FieldError errors={[form.formState.errors.departure_time]} />
            </Field>
          </div>

          <Field>
            <FieldLabel>Truck Station / Pos</FieldLabel>
            <FieldContent>
              <Input type="text" placeholder="(Opsional) Nama Pos / Dock" {...form.register('truck_station')} />
            </FieldContent>
            <FieldError errors={[form.formState.errors.truck_station]} />
          </Field>

          <Field>
            <FieldLabel>Status Jadwal</FieldLabel>
            <FieldContent className="flex items-center gap-2 mt-2">
              <Switch
                checked={form.watch('is_active')}
                onCheckedChange={(checked) => form.setValue('is_active', checked)}
              />
              <span className="text-sm text-muted-foreground">Aktifkan untuk menghasilkan slot harian</span>
            </FieldContent>
          </Field>

          <div className="flex justify-end pt-4 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
