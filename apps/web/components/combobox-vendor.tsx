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
import { useEffect, useRef } from 'react';

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
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && onLoadMore && !isLoading) {
          onLoadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [onLoadMore, isLoading]);

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
            {onLoadMore && (
              <div ref={observerTarget} className="h-4 w-full" />
            )}
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
