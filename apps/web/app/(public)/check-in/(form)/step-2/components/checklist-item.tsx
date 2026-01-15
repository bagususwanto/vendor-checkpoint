import { Field, FieldError } from '@/components/ui/field';
import IconLabel from '@/components/icon-label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import * as Icons from 'lucide-react';
import { ReactFormApi } from '@tanstack/react-form';

interface ChecklistItemProps {
  item: {
    checklist_item_id: number;
    item_text: string;
    is_required: boolean;
  };
  form: any;
}

export function ChecklistItem({ item, form }: ChecklistItemProps) {
  return (
    <form.Field
      name={`checklistItems.${item.checklist_item_id}`}
      children={(field: any) => {
        const isInvalid =
          field.state.meta.isTouched && !field.state.meta.isValid;
        return (
          <Field
            data-invalid={isInvalid}
            className={`space-y-2 bg-transparent p-4 border rounded-lg transition-colors duration-300 ${
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
                <Icons.CircleCheck className="w-5 h-5" />
                <span className="font-semibold text-base">YA</span>
              </ToggleGroupItem>
              <ToggleGroupItem
                value="false"
                className="flex justify-center items-center gap-2 data-[state=on]:bg-red-100 hover:bg-red-50 py-3 border data-[state=on]:border-destructive h-auto data-[state=on]:text-red-700 hover:text-red-700 active:scale-95 transition-all duration-200"
              >
                <Icons.CircleX className="w-5 h-5" />
                <span className="font-semibold text-base">TIDAK</span>
              </ToggleGroupItem>
            </ToggleGroup>
            {isInvalid && <FieldError errors={field.state.meta.errors} />}
          </Field>
        );
      }}
    />
  );
}
