import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SystemConfigResponse, UpdateSystemConfig } from '@repo/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateSystemConfigSchema } from '@repo/types';
import { useEffect } from 'react';
import { useUpdateSystemConfig } from '@/hooks/api/use-system-config';
import { Loader2 } from 'lucide-react';
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldDescription,
  FieldError,
} from '@/components/ui/field';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface SystemConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: SystemConfigResponse | null;
}

export function SystemConfigDialog({
  open,
  onOpenChange,
  config,
}: SystemConfigDialogProps) {
  const { mutate: updateConfig, isPending } = useUpdateSystemConfig();

  const form = useForm<UpdateSystemConfig>({
    resolver: zodResolver(updateSystemConfigSchema),
    defaultValues: {
      config_value: '',
    },
  });

  useEffect(() => {
    if (config) {
      form.reset({
        config_value: config.config_value,
      });
    }
  }, [config, form]);

  const onSubmit = (data: UpdateSystemConfig) => {
    if (!config) return;

    updateConfig(
      { id: config.config_id, data },
      {
        onSuccess: () => {
          onOpenChange(false);
          form.reset();
        },
      },
    );
  };

  if (!config) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Konfigurasi</DialogTitle>
          <DialogDescription>
            Ubah nilai untuk konfigurasi <strong>{config.config_key}</strong>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Field>
            <FieldLabel>Key</FieldLabel>
            <FieldContent>
              <Input value={config.config_key} disabled readOnly />
              <FieldDescription>
                Identifier unik untuk konfigurasi ini
              </FieldDescription>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Tipe</FieldLabel>
            <FieldContent>
              <Input value={config.config_type} disabled readOnly />
              <FieldDescription>
                Tipe data dari nilai konfigurasi
              </FieldDescription>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel required>Nilai</FieldLabel>
            <FieldContent>
              {config.config_type === 'boolean' ? (
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={form.watch('config_value') === 'true'}
                    onCheckedChange={(checked) =>
                      form.setValue('config_value', String(checked))
                    }
                  />
                  <Label>
                    {form.watch('config_value') === 'true'
                      ? 'Aktif'
                      : 'Tidak Aktif'}
                  </Label>
                </div>
              ) : config.config_type === 'text' ||
                config.config_type === 'json' ? (
                <Textarea
                  {...form.register('config_value')}
                  placeholder="Masukkan nilai konfigurasi"
                  rows={5}
                  className="font-mono text-sm"
                />
              ) : (
                <Input
                  {...form.register('config_value')}
                  type={config.config_type === 'number' ? 'number' : 'text'}
                  placeholder="Masukkan nilai konfigurasi"
                />
              )}
              <FieldError>
                {form.formState.errors.config_value?.message}
              </FieldError>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Deskripsi</FieldLabel>
            <FieldContent>
              <p className="text-sm text-muted-foreground">
                {config.description || '-'}
              </p>
            </FieldContent>
          </Field>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
