'use client';

import { useState } from 'react';
import { ComboboxVendor } from '@/components/combobox-vendor';
import IconLabel from '@/components/icon-label';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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

export default function CheckInStep2() {
  const router = useRouter();

  const [selectedVendor, setSelectedVendor] = useState<{
    label: string;
    value: string;
    category: string;
    vendorCode: string;
  } | null>(null);

  const companys = [
    {
      label: 'PT. ABC Indonesia',
      value: 'pt-abc-indonesia',
      category: 'BBM',
      vendorCode: 'VND-001',
    },
    {
      label: 'PT. XYZ Indonesia',
      value: 'pt-xyz-indonesia',
      category: 'Chemicals',
      vendorCode: 'VND-002',
    },
    {
      label: 'PT. 123 Indonesia',
      value: 'pt-123-indonesia',
      category: 'BBM',
      vendorCode: 'VND-003',
    },
  ];

  const handleSelectVendor = (value: string) => {
    const vendor = companys.find((c) => c.value === value);
    setSelectedVendor(vendor || null);
  };

  const checklistData = {
    safety: {
      icon: Icons.Shield,
      color: 'text-green-600',
      label: 'Safety Delivery',
      general: [
        'Apakah driver menggunakan APD (helm, sepatu safety)?',
        'Apakah kendaraan dalam kondisi layak jalan?',
        'Apakah dokumen kendaraan lengkap (STNK, SIM)?',
      ],
      specific: {
        Chemical: [
          'Apakah material kimia dikemas dengan benar dan berlabel?',
          'Apakah ada MSDS (Material Safety Data Sheet)?',
        ],
        BBM: [
          'Apakah tangki BBM tersegel dengan baik?',
          'Apakah ada alat pemadam kebakaran?',
        ],
      },
    },
    quality: {
      icon: Icons.Award,
      color: 'text-yellow-600',
      label: 'Quality',
      general: [
        'Apakah material/barang sesuai dengan PO?',
        'Apakah kemasan dalam kondisi baik (tidak rusak)?',
      ],
      specific: {
        Chemical: [
          'Apakah tanggal kadaluarsa masih valid?',
          'Apakah batch number tercantum dengan jelas?',
        ],
        'Spare Part & Tool mudah berkarat': [
          'Apakah part tidak ada karat atau kerusakan?',
        ],
      },
    },
    productivity: {
      icon: Icons.TrendingUp,
      color: 'text-blue-600',
      label: 'Productivity',
      general: [
        'Apakah dokumen delivery (surat jalan) lengkap?',
        'Apakah driver sudah konfirmasi waktu kedatangan?',
        'Apakah material siap untuk unloading?',
      ],
    },
    environment: {
      icon: Icons.Leaf,
      color: 'text-teal-600',
      label: 'Environment',
      general: [
        'Apakah tidak ada tumpahan material di kendaraan?',
        'Apakah limbah kemasan dibawa kembali?',
        'Apakah kendaraan memenuhi standar emisi?',
      ],
    },
  };

  return (
    <div>
      <Card className="w-full max-w-4xl">
        <CardHeader className="items-center text-center">
          <CardTitle className="text-2xl">Daftar Pemeriksaan</CardTitle>
          <CardDescription className="vendor-text">
            Jawab beberapa pertanyaan berikut sebelum memasuki area warehouse.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="space-y-6">
              <Accordion
                type="single"
                defaultValue="1"
                collapsible
                className="space-y-4"
              >
                {Object.entries(checklistData).map(([key, data]) => {
                  return (
                    <AccordionItem
                      key={key}
                      value={key}
                      className="border-2 last:border-b-2 rounded-lg"
                    >
                      <AccordionTrigger className="px-4 hover:no-underline">
                        <div className="flex justify-between items-center pr-4 w-full">
                          <div className="flex items-center gap-3">
                            <data.icon className={`w-5 h-5 ${data.color}`} />
                            <span className="font-semibold vendor-text">
                              {data.label}
                            </span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-6 px-4 pb-4">
                        {/* General Checklist */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-base">
                            Checklist Umum
                          </h4>
                          {data.general.map((question, idx) => (
                            <div
                              key={idx}
                              className="space-y-2 bg-background p-4 border rounded-lg"
                            >
                              <Label className="font-medium text-base">
                                {question}
                              </Label>
                            </div>
                          ))}
                        </div>

                        {/* Specific Checklist */}
                        {/* {'specific' in data &&
                          data.specific &&
                          formData.vendorCategory in data.specific && (
                            <div className="space-y-4">
                              <h4 className="font-medium text-base">
                                Checklist Khusus - {formData.vendorCategory}
                              </h4>
                              {(
                                (data.specific as any)[
                                  formData.vendorCategory
                                ] as string[]
                              ).map((question, idx) => (
                                <div
                                  key={idx}
                                  className="space-y-2 bg-background p-4 border rounded-lg"
                                >
                                  <Label className="font-medium text-base">
                                    {question}
                                  </Label>
                                  <RadioGroup
                                    value={formData.checklist[category][
                                      question
                                    ]?.toString()}
                                    onValueChange={(value) =>
                                      handleAnswerChange(
                                        category,
                                        question,
                                        value === 'true',
                                      )
                                    }
                                    className="flex gap-4"
                                  >
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem
                                        value="true"
                                        id={`${key}-specific-${idx}-yes`}
                                      />
                                      <Label
                                        htmlFor={`${key}-specific-${idx}-yes`}
                                        className="font-normal text-base cursor-pointer"
                                      >
                                        YA
                                      </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem
                                        value="false"
                                        id={`${key}-specific-${idx}-no`}
                                      />
                                      <Label
                                        htmlFor={`${key}-specific-${idx}-no`}
                                        className="font-normal text-base cursor-pointer"
                                      >
                                        TIDAK
                                      </Label>
                                    </div>
                                  </RadioGroup>
                                </div>
                              ))}
                            </div>
                          )} */}
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
