'use client';

import { useForm } from '@tanstack/react-form';
import { Search, Loader2, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldGroup } from '@/components/ui/field';
import IconLabel from '@/components/icon-label';
import { Card, CardContent } from '@/components/ui/card';
import { queueSearchSchema, type QueueSearch } from '@repo/types';
import { useEffect } from 'react';

interface QueueSearchFormProps {
  initialQueueNumber?: string | null;
  onSubmit: (data: QueueSearch) => void;
  isLoading: boolean;
}

export function QueueSearchForm({
  initialQueueNumber,
  onSubmit,
  isLoading,
}: QueueSearchFormProps) {
  const form = useForm({
    defaultValues: {
      queueNumber: initialQueueNumber || '',
    },
    validators: {
      onSubmit: queueSearchSchema,
    },
    onSubmit: async ({ value }) => {
      onSubmit(value);
    },
  });

  useEffect(() => {
    if (initialQueueNumber) {
      form.setFieldValue('queueNumber', initialQueueNumber);
    }
  }, [initialQueueNumber]);

  return (
    <Card className="bg-background/60 shadow-xl backdrop-blur-md border-muted/20">
      <CardContent className="pt-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field
              name="queueNumber"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <IconLabel
                      classNameIcon="w-6 h-6"
                      htmlFor="queueNumber"
                      icon={QrCode}
                      required
                    >
                      Nomor Antrean
                    </IconLabel>
                    <div className="relative">
                      <Search className="top-2.5 left-3 z-10 absolute w-5 h-5 text-muted-foreground" />
                      <Input
                        placeholder="Contoh: 20251212-001"
                        className="bg-background/80 pl-10 h-12 text-lg vendor-text"
                        id="queueNumber"
                        type="text"
                        autoComplete="off"
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                      />
                    </div>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <Button
              type="submit"
              size="xl"
              className="mt-4 w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                  Mengecek...
                </>
              ) : (
                'Cek Status'
              )}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
