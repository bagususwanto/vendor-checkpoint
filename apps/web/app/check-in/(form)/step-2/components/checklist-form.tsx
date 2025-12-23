'use client';

import { useForm } from '@tanstack/react-form';
import { useRouter } from 'next/navigation';
import { useChecklistStore } from '@/stores/use-checklist.store';
import { CheckInStep2Schema } from '@/lib/schemas/check-in-step-2.schema';

import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress as ProgressBar } from '@/components/ui/progress';
import { Accordion } from '@/components/ui/accordion';
import * as Icons from 'lucide-react';
import { ChecklistCategory } from './checklist-category';

export function ChecklistForm() {
  const router = useRouter();
  const { step1Data, step2Data, setStep2Data, checklistCategories } =
    useChecklistStore();
  const vendorCategory = step1Data?.company.category_name;

  const form = useForm({
    defaultValues: {
      checklistItems: step2Data?.checklistItems || {},
    },
    validators: {
      onSubmit: CheckInStep2Schema,
    },
    onSubmit: async ({ value }) => {
      setStep2Data(value);
      router.push('/check-in/step-3');
    },
  });

  // Calculate progress based on visible items
  const visibleItems = (checklistCategories || []).flatMap(
    (category) => category.mst_checklist_item,
  );

  const requiredItems = visibleItems.filter((item) => item.is_required);
  const totalRequiredItems = requiredItems.length;

  const categoriesToRender = (checklistCategories || []).map((c) => ({
    id: String(c.checklist_category_id),
    category_name: c.category_name,
    icon: c.icon_name,
    color: c.color_code,
    items: c.mst_checklist_item,
  }));

  return (
    <>
      <div className="top-32 z-20 sticky bg-card/80 shadow-sm backdrop-blur-md py-2 border-b w-full transition-all duration-300">
        <form.Subscribe
          selector={(state) => state.values.checklistItems}
          children={(checklistItems) => {
            const answerCount = requiredItems.reduce((count, item) => {
              if (
                checklistItems &&
                checklistItems[item.checklist_item_id.toString()]
              ) {
                return count + 1;
              }
              return count;
            }, 0);
            const progress = (answerCount / totalRequiredItems) * 100;
            const hasFailedItems = Object.entries(checklistItems || {}).some(
              ([_, value]) => value === 'false',
            );

            return (
              <div className="flex flex-col items-center gap-2 px-4 w-full">
                <div className="flex justify-between items-center w-full max-w-md font-medium text-sm">
                  <span>Progress Pengisian</span>
                  <span>
                    {Math.round(progress)}% ({answerCount}/
                    {totalRequiredItems})
                  </span>
                </div>
                <ProgressBar
                  value={progress}
                  className="w-full max-w-md h-1.5"
                />
                {hasFailedItems && (
                  <div className="slide-in-from-top-2 w-full max-w-md animate-in duration-300 fade-in">
                    <Alert
                      variant="destructive"
                      className="[&>svg]:top-0 [&>svg]:left-0 [&>svg]:relative flex items-center gap-2 px-3 py-2"
                    >
                      <Icons.AlertTriangle className="w-4 h-4 shrink-0" />
                      <AlertDescription className="m-0 p-0 text-xs leading-none">
                        Ada pertanyaan yang dijawab TIDAK. Pastikan kondisi
                        aman.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </div>
            );
          }}
        />
      </div>
      <CardContent>
        <form
          id="checklist-form"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="space-y-6">
            <form.Subscribe
              selector={(state) => state.values.checklistItems}
              children={(checklistItems) => (
                <Accordion type="multiple" className="space-y-4">
                  {categoriesToRender.map((category) => (
                    <ChecklistCategory
                      key={category.id}
                      category={category}
                      vendorCategory={vendorCategory}
                      checklistItems={checklistItems as Record<string, string>}
                      form={form}
                    />
                  ))}
                </Accordion>
              )}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-row justify-between gap-2">
        <Button
          size={'xl'}
          variant="outline"
          className="w-1/2"
          onClick={() => router.back()}
        >
          <Icons.ArrowLeft className="mr-2 size-6" />
          Kembali
        </Button>
        <form.Subscribe
          selector={(state) => state.values.checklistItems}
          children={(checklistItems) => {
            const answerCount = requiredItems.reduce((count, item) => {
              if (
                checklistItems &&
                checklistItems[item.checklist_item_id.toString()]
              ) {
                return count + 1;
              }
              return count;
            }, 0);
            const progress = (answerCount / totalRequiredItems) * 100;

            return (
              <Button
                size={'xl'}
                type="submit"
                className="w-1/2"
                form="checklist-form"
                disabled={Math.round(progress) < 100}
              >
                Lanjut
                <Icons.CircleArrowRight className="ml-2 size-6" />
              </Button>
            );
          }}
        />
      </CardFooter>
    </>
  );
}
