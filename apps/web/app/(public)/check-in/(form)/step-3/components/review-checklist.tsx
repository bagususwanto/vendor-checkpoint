import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useChecklistStore } from '@/stores/use-checklist.store';
import { Badge } from '@/components/ui/badge';

interface ReviewChecklistProps {
  step2Data: {
    checklistItems: Record<string, string>;
  } | null;
}

export function ReviewChecklist({ step2Data }: ReviewChecklistProps) {
  const { checklistCategories } = useChecklistStore();

  if (!step2Data) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Ringkasan Checklist</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 h-[300px] overflow-y-scroll">
        {(checklistCategories || []).map((category) => {
          const Icon = Icons[
            category.icon_name as keyof typeof Icons
          ] as React.ElementType;

          const visibleItems = category.mst_checklist_item;

          if (!visibleItems || visibleItems.length === 0) return null;

          const answeredItems = (visibleItems || [])
            .filter(
              (item) =>
                step2Data.checklistItems[item.checklist_item_id.toString()],
            )
            .sort((a, b) => {
              // Primary sort: item_type (UMUM before KHUSUS)
              if (a.item_type === 'UMUM' && b.item_type !== 'UMUM') return -1;
              if (a.item_type !== 'UMUM' && b.item_type === 'UMUM') return 1;

              // Secondary sort: display_order
              return (a.display_order || 0) - (b.display_order || 0);
            });

          if (answeredItems.length === 0) return null;

          return (
            <div key={category.checklist_category_id} className="space-y-3">
              <div className="flex items-center gap-2 font-medium text-base">
                {Icon && <Icon className={`w-5 h-5 ${category.color_code}`} />}
                {category.category_name}
              </div>
              <div className="gap-3 grid pl-7">
                {answeredItems.map((item) => {
                  const answer =
                    step2Data.checklistItems[item.checklist_item_id.toString()];
                  return (
                    <div
                      key={item.checklist_item_id}
                      className="flex justify-between items-start gap-4 pb-3 last:pb-0 last:border-0 border-b"
                    >
                      <div className="flex flex-col gap-1.5">
                        <span className="text-muted-foreground text-sm">
                          {item.item_text}
                        </span>
                        <div>
                          <Badge
                            variant="secondary"
                            className="bg-muted text-[10px] py-0 h-4 uppercase"
                          >
                            {item.item_type}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 font-medium shrink-0">
                        {answer === 'true' ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span className="text-green-700 text-sm">YA</span>
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
  );
}
