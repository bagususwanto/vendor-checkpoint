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
import {
  Building2,
  SendHorizonal,
  User,
  Tag,
  ScanBarcode,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useChecklistStore } from '@/stores/use-checklist.store';
import { checklistData } from '@/lib/data/checklist';
import * as Icons from 'lucide-react';

export default function CheckInStep1() {
  const { step1Data, step2Data } = useChecklistStore();
  const router = useRouter();

  return (
    <div>
      <Card className="w-full max-w-4xl">
        <CardHeader className="items-center text-center">
          <CardTitle className="text-2xl">Konfirmasi Data</CardTitle>
          <CardDescription className="vendor-text">
            Periksa kembali data Anda sebelum submit.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Card className="bg">
            <CardHeader>
              <CardTitle className="text-lg">Identitas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground text-sm">
                      Nama Lengkap
                    </p>
                    <p className="font-medium text-lg">{step1Data?.fullName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground text-sm">Perusahaan</p>
                    <p className="font-medium text-lg">
                      {step1Data?.company.label}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Tag className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground text-sm">Kategori</p>
                    <p className="font-medium text-lg">
                      {step1Data?.company.category}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ScanBarcode className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground text-sm">
                      Kode Perusahaan
                    </p>
                    <p className="font-medium text-lg">
                      {step1Data?.company.vendorCode}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ringkasan Checklist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 h-[300px] overflow-y-scroll">
              {checklistData.map((category) => {
                const Icon = Icons[
                  category.icon as unknown as keyof typeof Icons
                ] as React.ElementType;

                const vendorCategory = step1Data?.company.category;
                const generalItems = category.items.filter(
                  (item) => item.item_type === 'UMUM',
                );
                const specificItems = category.items.filter(
                  (item) =>
                    item.item_type === 'KHUSUS' &&
                    item.category_name === vendorCategory,
                );

                const visibleItems = [...generalItems, ...specificItems];

                if (visibleItems.length === 0) return null;

                // Only show category if at least one item has been answered (although user can't proceed without answering required items)
                // Or just show all visible items since they assume they are filled if they reached this step?
                // Let's filter to only those that have a value in step2Data

                const answeredItems = visibleItems.filter(
                  (item) =>
                    step2Data?.checklistItems[
                      item.checklist_item_id.toString()
                    ],
                );

                if (answeredItems.length === 0) return null;

                return (
                  <div key={category.id} className="space-y-3">
                    <div className="flex items-center gap-2 font-medium text-base">
                      {Icon && <Icon className={`w-5 h-5 ${category.color}`} />}
                      {category.category_name}
                    </div>
                    <div className="gap-3 grid pl-7">
                      {answeredItems.map((item) => {
                        const answer =
                          step2Data?.checklistItems[
                            item.checklist_item_id.toString()
                          ];
                        return (
                          <div
                            key={item.checklist_item_id}
                            className="flex justify-between items-start gap-4 pb-3 last:pb-0 last:border-0 border-b"
                          >
                            <span className="text-muted-foreground text-sm">
                              {item.item_text}
                            </span>
                            <div className="flex items-center gap-1.5 font-medium shrink-0">
                              {answer === 'true' ? (
                                <>
                                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                                  <span className="text-green-700 text-sm">
                                    YA
                                  </span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-4 h-4 text-destructive" />
                                  <span className="text-destructive text-sm">
                                    TIDAK
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </CardContent>
        <CardFooter>
          <Button
            size={'xl'}
            type="submit"
            form="vendor-identity-form"
            className="w-full"
          >
            Submit
            <SendHorizonal className="ml-2 size-6" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
