'use client';

import { useRouter } from 'next/navigation';
import { useForm } from '@tanstack/react-form';
import { Clock, ArrowLeft, CircleArrowRight } from 'lucide-react';
import { useChecklistStore } from '@/stores/use-checklist.store';
import { useDelayReasons } from '@/hooks/api/use-delay-reasons';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Field, FieldError } from '@/components/ui/field';
import IconLabel from '@/components/icon-label';

export function LateReasonForm() {
  const router = useRouter();
  const { step1Data, setStep1Data } = useChecklistStore();

  const { data: delayReasons, isLoading } = useDelayReasons({
    category: 'Arrival',
    isActive: true,
  });

  const form = useForm({
    defaultValues: {
      delayArrivalReasonId: step1Data?.delayArrivalReasonId?.toString() || '',
    },
    onSubmit: async ({ value }) => {
      if (step1Data) {
        const selectedReason = delayReasons?.data?.find(
          (r: any) => r.delay_reason_id.toString() === value.delayArrivalReasonId,
        );

        setStep1Data({
          ...step1Data,
          delayArrivalReasonId: parseInt(value.delayArrivalReasonId),
          delayArrivalReasonLabel: selectedReason?.reason_text,
        });
      }
      router.push('/check-in/step-2');
    },
  });

  return (
    <>
      <form
        id="late-reason-form"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div className="space-y-6">
          <form.Field
            name="delayArrivalReasonId"
            validators={{
              onChange: ({ value }) =>
                !value
                  ? { message: 'Alasan keterlambatan harus dipilih' }
                  : undefined,
            }}
            children={(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <IconLabel
                    classNameIcon="w-6 h-6"
                    htmlFor="delayArrivalReasonId"
                    icon={Clock}
                    required
                  >
                    Pilih Alasan Keterlambatan
                  </IconLabel>
                  <Select
                    value={field.state.value}
                    onValueChange={(val) => field.handleChange(val)}
                  >
                    <SelectTrigger className="h-12 vendor-text">
                      <SelectValue placeholder={isLoading ? "Memuat..." : "--- Pilih Alasan ---"} />
                    </SelectTrigger>
                    <SelectContent>
                      {delayReasons?.data?.map((reason: any) => (
                        <SelectItem
                          key={reason.delay_reason_id}
                          value={reason.delay_reason_id.toString()}
                        >
                          {reason.reason_text}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        </div>
      </form>

      <CardFooter className="flex flex-row justify-between gap-2 px-0 pt-6">
        <Button
          type="button"
          size={'xl'}
          variant="outline"
          className="w-1/2"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 w-6 h-6" />
          Kembali
        </Button>
        <Button
          size={'xl'}
          type="submit"
          form="late-reason-form"
          className="w-1/2"
          disabled={form.state.isSubmitting}
        >
          {form.state.isSubmitting ? 'Memuat...' : 'Lanjut'}
          <CircleArrowRight className="ml-2 w-6 h-6" />
        </Button>
      </CardFooter>
    </>
  );
}
