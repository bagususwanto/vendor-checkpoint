'use client';

import { useState } from 'react';
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
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useForm } from '@tanstack/react-form';
import { useChecklistStore } from '@/stores/use-checklist.store';
import { VendorIdentitySchema } from '@/lib/schemas/vendor-identity.schema';
import IconLabel from '@/components/icon-label';

const checklistData = [
  {
    category_name: 'Safety Delivery',
    display_order: 1,
    id: 'safety',
    items: [
      {
        checklist_item_id: 1,
        item_text: 'Apakah driver menggunakan APD (helm, sepatu safety)?',
        item_type: 'UMUM',
        is_required: true,
      },
      {
        checklist_item_id: 2,
        item_text: 'Apakah kendaraan dalam kondisi layak jalan?',
        item_type: 'UMUM',
        is_required: true,
      },
      {
        checklist_item_id: 3,
        item_text: 'Apakah dokumen kendaraan lengkap (STNK, SIM)?',
        item_type: 'UMUM',
        is_required: true,
      },
      // Specific Items
      {
        checklist_item_id: 12,
        item_text: 'Apakah material kimia dikemas dengan benar dan berlabel?',
        item_type: 'KHUSUS',
        is_required: true,
        category_name: 'Chemicals',
      },
      {
        checklist_item_id: 13,
        item_text: 'Apakah ada MSDS (Material Safety Data Sheet)?',
        item_type: 'KHUSUS',
        is_required: true,
        category_name: 'Chemicals',
      },
      {
        checklist_item_id: 14,
        item_text: 'Apakah tangki BBM tersegel dengan baik?',
        item_type: 'KHUSUS',
        is_required: true,
        category_name: 'BBM',
      },
      {
        checklist_item_id: 15,
        item_text: 'Apakah ada alat pemadam kebakaran?',
        item_type: 'KHUSUS',
        is_required: true,
        category_name: 'BBM',
      },
    ],
  },
  {
    category_name: 'Quality',
    display_order: 2,
    id: 'quality',
    items: [
      {
        checklist_item_id: 4,
        item_text: 'Apakah material/barang sesuai dengan PO?',
        item_type: 'UMUM',
        is_required: true,
      },
      {
        checklist_item_id: 5,
        item_text: 'Apakah kemasan dalam kondisi baik (tidak rusak)?',
        item_type: 'UMUM',
        is_required: true,
      },
      // Specific Items
      {
        checklist_item_id: 16,
        item_text: 'Apakah tanggal kadaluarsa masih valid?',
        item_type: 'KHUSUS',
        is_required: true,
        category_name: 'Chemicals',
      },
      {
        checklist_item_id: 17,
        item_text: 'Apakah batch number tercantum dengan jelas?',
        item_type: 'KHUSUS',
        is_required: true,
        category_name: 'Chemicals',
      },
      {
        checklist_item_id: 18,
        item_text: 'Apakah part tidak ada karat atau kerusakan?',
        item_type: 'KHUSUS',
        is_required: true,
        category_name: 'Spare Part & Tool mudah berkarat',
      },
    ],
  },
  {
    category_name: 'Productivity',
    display_order: 3,
    id: 'productivity',
    items: [
      {
        checklist_item_id: 6,
        item_text: 'Apakah dokumen delivery (surat jalan) lengkap?',
        item_type: 'UMUM',
        is_required: true,
      },
      {
        checklist_item_id: 7,
        item_text: 'Apakah driver sudah konfirmasi waktu kedatangan?',
        item_type: 'UMUM',
        is_required: true,
      },
      {
        checklist_item_id: 8,
        item_text: 'Apakah material siap untuk unloading?',
        item_type: 'UMUM',
        is_required: true,
      },
    ],
  },
  {
    category_name: 'Environment',
    display_order: 4,
    id: 'environment',
    items: [
      {
        checklist_item_id: 9,
        item_text: 'Apakah tidak ada tumpahan material di kendaraan?',
        item_type: 'UMUM',
        is_required: true,
      },
      {
        checklist_item_id: 10,
        item_text: 'Apakah limbah kemasan dibawa kembali?',
        item_type: 'UMUM',
        is_required: true,
      },
      {
        checklist_item_id: 11,
        item_text: 'Apakah kendaraan memenuhi standar emisi?',
        item_type: 'UMUM',
        is_required: true,
      },
    ],
  },
];

const categoryUiConfig: Record<
  string,
  { icon: React.ElementType; color: string }
> = {
  safety: {
    icon: Icons.Shield,
    color: 'text-green-600',
  },
  quality: {
    icon: Icons.Award,
    color: 'text-yellow-600',
  },
  productivity: {
    icon: Icons.TrendingUp,
    color: 'text-blue-600',
  },
  environment: {
    icon: Icons.Leaf,
    color: 'text-teal-600',
  },
};

export default function CheckInStep2() {
  const router = useRouter();
  const { step1Data, setStep1Data } = useChecklistStore();
  const vendorCategory = step1Data?.company.category;

  const form = useForm({
    defaultValues: {
      fullName: step1Data?.fullName || '',
      company: {
        value: step1Data?.company.value || '',
        category: step1Data?.company.category || '',
        vendorCode: step1Data?.company.vendorCode || '',
      },
    },
    validators: {
      onSubmit: VendorIdentitySchema,
    },
    onSubmit: async ({ value }) => {
      setStep1Data(value);
      router.push('/check-in/step-2');
    },
  });

  return (
    <div>
      <Card className="w-full max-w-4xl">
        <CardHeader className="items-center text-center">
          <CardTitle className="text-2xl">Daftar Pemeriksaan</CardTitle>
          <CardDescription className="vendor-text">
            Jawab beberapa pertanyaan berikut sebelum memasuki area warehouse.
          </CardDescription>
          <div className="flex justify-center items-center gap-2 pt-2">
            <Badge variant="outline" className="px-4 py-1 text-base">
              Progress: 0/15 Terjawab
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <form>
            <div className="space-y-6">
              <Accordion
                type="single"
                defaultValue="safety"
                collapsible
                className="space-y-4"
              >
                {checklistData.map((category) => {
                  const uiConfig =
                    categoryUiConfig[
                      category.id as keyof typeof categoryUiConfig
                    ]!;

                  // Filter items
                  const generalItems = category.items.filter(
                    (item) => item.item_type === 'UMUM',
                  );
                  const specificItems = category.items.filter(
                    (item) =>
                      item.item_type === 'KHUSUS' &&
                      item.category_name === vendorCategory,
                  );

                  // Calculate progress (simplified for now, total = valid items)
                  const totalItems = generalItems.length + specificItems.length;
                  const progress = {
                    answered: 0,
                    total: totalItems,
                  };
                  const isComplete = progress.answered === progress.total;

                  return (
                    <AccordionItem
                      key={category.id}
                      value={category.id}
                      className="border-2 last:border-b-2 rounded-lg"
                    >
                      <AccordionTrigger className="px-4 hover:no-underline">
                        <div className="flex justify-between items-center pr-4 w-full">
                          <div className="flex items-center gap-3">
                            <uiConfig.icon
                              className={`w-5 h-5 ${uiConfig.color}`}
                            />
                            <span className="font-semibold vendor-text">
                              {category.category_name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              className="px-2 py-1 text-sm"
                              variant={isComplete ? 'default' : 'secondary'}
                            >
                              {progress.answered}/{progress.total}
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
                          {generalItems.map((item, idx) => (
                            <div
                              key={item.checklist_item_id}
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
                                spacing={4}
                                type="single"
                                size={'lg'}
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
                            </div>
                          ))}
                        </div>

                        {/* Specific Checklist */}
                        {specificItems.length > 0 && (
                          <div className="space-y-4">
                            <h4 className="font-medium text-base">
                              Checklist Khusus - {vendorCategory}
                            </h4>
                            {specificItems.map((item, idx) => (
                              <div
                                key={item.checklist_item_id}
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
                                  spacing={4}
                                  type="single"
                                  size={'lg'}
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
                              </div>
                            ))}
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
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
            onClick={() => router.push('/check-in/step-3')}
          >
            Lanjut
            <Icons.CircleArrowRight className="ml-2 size-6" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
