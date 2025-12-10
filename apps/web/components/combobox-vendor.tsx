'use client';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from '@/components/ui/shadcn-io/combobox';

export function ComboboxVendor({
  dataOptions,
  type,
  onSelect,
  value,
}: {
  dataOptions: { label: string; value: string }[];
  type: string;
  onSelect?: (value: string) => void;
  value?: string;
}) {
  return (
    <Combobox
      data={dataOptions}
      onOpenChange={(open) => console.log('Combobox is open?', open)}
      onValueChange={(newValue) => {
        console.log('Combobox value:', newValue);
        if (onSelect) {
          onSelect(newValue);
        }
      }}
      type={type}
      value={value}
    >
      <ComboboxTrigger className="h-12 vendor-text" />
      <ComboboxContent className="vendor-text">
        <ComboboxInput className="vendor-text" classNameInput="h-12" />
        <ComboboxEmpty className="py-6 text-center vendor-text" />
        <ComboboxList>
          <ComboboxGroup>
            {dataOptions.map((data) => (
              <ComboboxItem
                className="vendor-text"
                key={data.value}
                value={data.value}
              >
                {data.label}
              </ComboboxItem>
            ))}
          </ComboboxGroup>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
