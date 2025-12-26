import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
} from "@/components/ui/item"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface DropdownMaterialCategoryProps {
  options: {
    label: string;
    value: string;
    description?: string;
  }[];
  value?: string;
  onSelect: (value: string) => void;
  isLoading?: boolean;
  onSearch?: (term: string) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export function DropdownMaterialCategory({
  options,
  value,
  onSelect,
  isLoading,
  onSearch,
  onLoadMore,
  hasMore,
}: DropdownMaterialCategoryProps) {
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="flex w-full flex-col gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="xl"
            className="w-full justify-between items-center text-left text-lg font-normal"
          >
            {selectedOption ? (
              <div className="flex flex-col items-start text-sm">
                <span className="font-semibold">{selectedOption.label}</span>
                <span className="text-xs text-muted-foreground">{selectedOption.description}</span>
              </div>
            ) : (
              <span className="text-muted-foreground">Pilih kategori material...</span>
            )}
            <ChevronDownIcon className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-[300px]" align="start">
          {onSearch && (
            <div className="p-2 sticky top-0 bg-popover z-10">
              <Input
                placeholder="Cari kategori..."
                className="h-9"
                onChange={(e) => onSearch(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()} 
              />
            </div>
          )}
          <div className="overflow-y-auto max-h-[200px]">
            {isLoading && options.length === 0 ? (
               <div className="p-4 text-center text-sm text-muted-foreground">Memuat...</div>
            ) : options.length > 0 ? (
              <>
                {options.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    className={cn(
                      "p-0 cursor-pointer",
                      value === option.value && "bg-accent"
                    )}
                    onClick={() => onSelect(option.value)}
                  >
                    <Item size="sm" className="w-full p-2">
                      <ItemContent className="gap-0.5">
                        <ItemTitle>{option.label}</ItemTitle>
                        {option.description && (
                          <ItemDescription>{option.description}</ItemDescription>
                        )}
                      </ItemContent>
                    </Item>
                  </DropdownMenuItem>
                ))}
                 {hasMore && onLoadMore && (
                  <div className="p-2 text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onLoadMore();
                      }}
                      disabled={isLoading}
                    >
                      {isLoading ? "Memuat..." : "Muat lebih banyak"}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Tidak ada data.
              </div>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
