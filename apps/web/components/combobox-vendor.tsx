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
  onSearch,
  onLoadMore,
  isLoading,
}: {
  dataOptions: { label: string; value: string }[];
  type: string;
  onSelect?: (value: string) => void;
  value?: string;
  onSearch?: (value: string) => void;
  onLoadMore?: () => void;
  isLoading?: boolean;
}) {
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 20) {
      if (onLoadMore && !isLoading) {
        onLoadMore();
      }
    }
  };

  return (
    <Combobox
      data={dataOptions}
      onValueChange={(newValue) => {
        if (onSelect) {
          onSelect(newValue);
        }
      }}
      type={type}
      value={value}
    >
      <ComboboxTrigger className="h-12 vendor-text" />
      <ComboboxContent
        className="vendor-text"
        shouldFilter={!onSearch}
      >
        <ComboboxInput
          className="vendor-text"
          classNameInput="h-12"
          onValueChange={onSearch}
        />
        <ComboboxEmpty className="py-6 text-center vendor-text" />
        <ComboboxList onScroll={handleScroll}>
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
            {isLoading && (
              <div className="py-2 text-center text-sm text-muted-foreground">
                Loading...
              </div>
            )}
          </ComboboxGroup>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
