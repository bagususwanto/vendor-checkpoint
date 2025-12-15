'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress as ProgressBar } from '@/components/ui/progress';
import { useRouter } from 'next/navigation';
import * as Icons from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useForm } from '@tanstack/react-form';
import { useChecklistStore } from '@/stores/use-checklist.store';
import { CheckInStep2Schema } from '@/lib/schemas/check-in-step-2.schema';
import IconLabel from '@/components/icon-label';
import { checklistData } from '@/lib/data/checklist';
import { Field, FieldError } from '@/components/ui/field';

export default function CheckInStep2() {
  const router = useRouter();
  const { step1Data, step2Data, setStep2Data } = useChecklistStore();
  const vendorCategory = step1Data?.company.category;

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
  const visibleItems = checklistData.flatMap((category) => {
    const generalItems = category.items.filter(
      (item) => item.item_type === 'UMUM',
    );
    const specificItems = category.items.filter(
      (item) =>
        item.item_type === 'KHUSUS' && item.category_name === vendorCategory,
    );
    return [...generalItems, ...specificItems];
  });

  const requiredItems = visibleItems.filter((item) => item.is_required);
  const totalRequiredItems = requiredItems.length;

  return (
    <div>
      <Card className="w-full max-w-4xl">
        <CardHeader className="items-center text-center">
          <CardTitle className="text-2xl">Daftar Pemeriksaan</CardTitle>
          <CardDescription className="vendor-text">
            Jawab beberapa pertanyaan berikut sebelum memasuki area warehouse.
          </CardDescription>
        </CardHeader>
        <div className="top-0 z-20 sticky bg-card/80 shadow-sm backdrop-blur-md py-2 border-b w-full transition-all duration-300">
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
                  <Accordion
                    type="single"
                    defaultValue="safety"
                    collapsible
                    className="space-y-4"
                  >
                    {checklistData.map((category) => {
                      const Icon = Icons[
                        category.icon as unknown as keyof typeof Icons
                      ] as React.ElementType;

                      // Filter items
                      const generalItems = category.items.filter(
                        (item) => item.item_type === 'UMUM',
                      );
                      const specificItems = category.items.filter(
                        (item) =>
                          item.item_type === 'KHUSUS' &&
                          item.category_name === vendorCategory,
                      );

                      // Calculate category progress
                      const categoryItems = [...generalItems, ...specificItems];
                      const categoryTotal = categoryItems.length;
                      const categoryAnswered = categoryItems.reduce(
                        (count, item) => {
                          if (
                            checklistItems &&
                            checklistItems[item.checklist_item_id.toString()]
                          ) {
                            return count + 1;
                          }
                          return count;
                        },
                        0,
                      );

                      const isComplete =
                        categoryTotal > 0 && categoryAnswered === categoryTotal;

                      return (
                        <AccordionItem
                          key={category.id}
                          value={category.id}
                          className={`border-2 last:border-b-2 rounded-lg transition-all duration-300 ${
                            isComplete
                              ? 'border-primary/50 bg-primary/5 shadow-md shadow-primary/10'
                              : ''
                          }`}
                        >
                          <AccordionTrigger className="px-4 hover:no-underline">
                            <div className="flex justify-between items-center pr-4 w-full">
                              <div className="flex items-center gap-3">
                                {Icon && (
                                  <Icon
                                    className={`w-5 h-5 ${category.color}`}
                                  />
                                )}
                                <span className="font-semibold vendor-text">
                                  {category.category_name}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge
                                  className="px-2 py-1 text-sm"
                                  variant={isComplete ? 'default' : 'secondary'}
                                >
                                  {categoryAnswered}/{categoryTotal}
                                </Badge>
                                {isComplete && (
                                  <Icons.CheckCircle2 className="w-6 h-6 text-success" />
                                )}
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="space-y-6 px-4 pb-4">
                            {/* General Checklist */}
                            <div className="space-y-4">
                              <h4 className="font-medium text-base">
                                Checklist Umum
                              </h4>
                              {generalItems.map((item) => (
                                <form.Field
                                  key={item.checklist_item_id}
                                  name={`checklistItems.${item.checklist_item_id}`}
                                  children={(field) => {
                                    const isInvalid =
                                      field.state.meta.isTouched &&
                                      !field.state.meta.isValid;
                                    return (
                                      <Field
                                        data-invalid={isInvalid}
                                        className={`space-y-2 bg-background p-4 border rounded-lg transition-colors duration-300 ${
                                          field.state.value === 'false'
                                            ? 'border-destructive bg-red-50/50'
                                            : ''
                                        }`}
                                      >
                                        <IconLabel
                                          htmlFor={item.checklist_item_id.toString()}
                                          required={item.is_required}
                                        >
                                          {item.item_text}
                                        </IconLabel>
                                        <ToggleGroup
                                          variant={'outline'}
                                          type="single"
                                          size={'lg'}
                                          spacing={2}
                                          value={field.state.value}
                                          onValueChange={(val) => {
                                            if (val) field.handleChange(val);
                                          }}
                                          className="gap-4 grid grid-cols-2 w-full"
                                        >
                                          <ToggleGroupItem
                                            value="true"
                                            className="flex justify-center items-center gap-2 data-[state=on]:bg-green-100 hover:bg-green-50 py-3 border data-[state=on]:border-green-600 h-auto data-[state=on]:text-green-700 hover:text-green-700 active:scale-95 transition-all duration-200"
                                          >
                                            <Icons.CircleCheck className="size-5" />
                                            <span className="font-semibold text-base">
                                              YA
                                            </span>
                                          </ToggleGroupItem>
                                          <ToggleGroupItem
                                            value="false"
                                            className="flex justify-center items-center gap-2 data-[state=on]:bg-red-100 hover:bg-red-50 py-3 border data-[state=on]:border-destructive h-auto data-[state=on]:text-red-700 hover:text-red-700 active:scale-95 transition-all duration-200"
                                          >
                                            <Icons.CircleX className="size-5" />
                                            <span className="font-semibold text-base">
                                              TIDAK
                                            </span>
                                          </ToggleGroupItem>
                                        </ToggleGroup>
                                        {isInvalid && (
                                          <FieldError
                                            errors={field.state.meta.errors}
                                          />
                                        )}
                                      </Field>
                                    );
                                  }}
                                />
                              ))}
                            </div>

                            {/* Specific Checklist */}
                            {specificItems.length > 0 && (
                              <div className="space-y-4">
                                <h4 className="font-medium text-base">
                                  Checklist Khusus - {vendorCategory}
                                </h4>
                                {specificItems.map((item) => (
                                  <form.Field
                                    key={item.checklist_item_id}
                                    name={`checklistItems.${item.checklist_item_id}`}
                                    children={(field) => {
                                      const isInvalid =
                                        field.state.meta.isTouched &&
                                        !field.state.meta.isValid;
                                      return (
                                        <Field
                                          data-invalid={isInvalid}
                                          className={`space-y-2 bg-background p-4 border rounded-lg transition-colors duration-300 ${
                                            field.state.value === 'false'
                                              ? 'border-destructive bg-red-50/50'
                                              : ''
                                          }`}
                                        >
                                          <IconLabel
                                            htmlFor={item.checklist_item_id.toString()}
                                            required={item.is_required}
                                          >
                                            {item.item_text}
                                          </IconLabel>
                                          <ToggleGroup
                                            variant={'outline'}
                                            type="single"
                                            size={'lg'}
                                            spacing={2}
                                            value={field.state.value}
                                            onValueChange={(val) => {
                                              if (val) field.handleChange(val);
                                            }}
                                            className="gap-4 grid grid-cols-2 w-full"
                                          >
                                            <ToggleGroupItem
                                              value="true"
                                              className="flex justify-center items-center gap-2 data-[state=on]:bg-green-100 hover:bg-green-50 py-3 border data-[state=on]:border-green-600 h-auto data-[state=on]:text-green-700 hover:text-green-700 active:scale-95 transition-all duration-200"
                                            >
                                              <Icons.CircleCheck className="size-5" />
                                              <span className="font-semibold text-base">
                                                YA
                                              </span>
                                            </ToggleGroupItem>
                                            <ToggleGroupItem
                                              value="false"
                                              className="flex justify-center items-center gap-2 data-[state=on]:bg-red-100 hover:bg-red-50 py-3 border data-[state=on]:border-destructive h-auto data-[state=on]:text-red-700 hover:text-red-700 active:scale-95 transition-all duration-200"
                                            >
                                              <Icons.CircleX className="size-5" />
                                              <span className="font-semibold text-base">
                                                TIDAK
                                              </span>
                                            </ToggleGroupItem>
                                          </ToggleGroup>
                                          {isInvalid && (
                                            <FieldError
                                              errors={field.state.meta.errors}
                                            />
                                          )}
                                        </Field>
                                      );
                                    }}
                                  />
                                ))}
                              </div>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
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
      </Card>
    </div>
  );
}
