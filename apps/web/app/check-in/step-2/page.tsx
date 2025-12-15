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

  const totalItems = visibleItems.length;

  return (
    <div>
      <Card className="w-full max-w-4xl">
        <CardHeader className="items-center text-center">
          <CardTitle className="text-2xl">Daftar Pemeriksaan</CardTitle>
          <CardDescription className="vendor-text">
            Jawab beberapa pertanyaan berikut sebelum memasuki area warehouse.
          </CardDescription>
          <div className="flex justify-center items-center gap-2 pt-2">
            <form.Subscribe
              selector={(state) => state.values.checklistItems}
              children={(checklistItems) => {
                const answerCount = visibleItems.reduce((count, item) => {
                  if (checklistItems && checklistItems[item.checklist_item_id.toString()]) {
                    return count + 1;
                  }
                  return count;
                }, 0);
                return (
                  <Badge variant="outline" className="px-4 py-1 text-base">
                    Progress: {answerCount}/{totalItems} Terjawab
                  </Badge>
                );
              }}
            />
          </div>
        </CardHeader>
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
                          className="border-2 last:border-b-2 rounded-lg"
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
                                  <Icons.CheckCircle2 className="w-5 h-5 text-success" />
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
                                        className="space-y-2 bg-background p-4 border rounded-lg"
                                      >
                                        <IconLabel
                                          htmlFor={item.checklist_item_id.toString()}
                                          required={item.is_required}
                                        >
                                          {item.item_text}
                                        </IconLabel>
                                        <ToggleGroup
                                          variant={'outline'}
                                           spacing={2}
                                          type="single"
                                          size={'lg'}
                                          value={field.state.value}
                                          onValueChange={(val) => {
                                            if (val) field.handleChange(val);
                                          }}
                                        >
                                          <ToggleGroupItem
                                            value="true"
                                            className="gap-2 data-[state=on]:bg-green-100 hover:bg-green-50 border data-[state=on]:border-green-600 data-[state=on]:text-green-700 hover:text-green-700 active:scale-95 transition-all duration-200"
                                          >
                                            <Icons.CircleCheck className="size-5" />
                                            Ya
                                          </ToggleGroupItem>
                                          <ToggleGroupItem
                                            value="false"
                                            className="gap-2 data-[state=on]:bg-red-100 hover:bg-red-50 border data-[state=on]:border-red-600 data-[state=on]:text-red-700 hover:text-red-700 active:scale-95 transition-all duration-200"
                                          >
                                            <Icons.CircleX className="size-5" />
                                            Tidak
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
                                          className="space-y-2 bg-background p-4 border rounded-lg"
                                        >
                                          <IconLabel
                                            htmlFor={item.checklist_item_id.toString()}
                                            required={item.is_required}
                                          >
                                            {item.item_text}
                                          </IconLabel>
                                          <ToggleGroup
                                            variant={'outline'}
                                            spacing={2}
                                            type="single"
                                            size={'lg'}
                                            value={field.state.value}
                                            onValueChange={(val) => {
                                              if (val) field.handleChange(val);
                                            }}
                                          >
                                            <ToggleGroupItem
                                              value="true"
                                              className="gap-2 data-[state=on]:bg-green-100 hover:bg-green-50 border data-[state=on]:border-green-600 data-[state=on]:text-green-700 hover:text-green-700 active:scale-95 transition-all duration-200"
                                            >
                                              <Icons.CircleCheck className="size-5" />
                                              Ya
                                            </ToggleGroupItem>
                                            <ToggleGroupItem
                                              value="false"
                                              className="gap-2 data-[state=on]:bg-red-100 hover:bg-red-50 border data-[state=on]:border-red-600 data-[state=on]:text-red-700 hover:text-red-700 active:scale-95 transition-all duration-200"
                                            >
                                              <Icons.CircleX className="size-5" />
                                              Tidak
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
          <Button
            size={'xl'}
            type="submit"
            className="w-1/2"
            form="checklist-form"
          >
            Lanjut
            <Icons.CircleArrowRight className="ml-2 size-6" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
