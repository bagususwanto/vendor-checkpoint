import * as Icons from 'lucide-react';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { ChecklistItem } from './checklist-item';
import { ReactFormApi } from '@tanstack/react-form';

interface ChecklistCategoryProps {
  category: {
    id: string;
    category_name: string;
    icon: string;
    color: string;
    items: any[];
  };
  vendorCategory: string | undefined;
  checklistItems: Record<string, string>;
  form: any;
}

export function ChecklistCategory({ category, vendorCategory, checklistItems, form }: ChecklistCategoryProps) {
  const Icon = Icons[category.icon as keyof typeof Icons] as React.ElementType;

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
            <ChecklistItem 
                key={item.checklist_item_id}
                item={item}
                form={form}
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
              <ChecklistItem 
                key={item.checklist_item_id}
                item={item}
                form={form}
              />
            ))}
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
