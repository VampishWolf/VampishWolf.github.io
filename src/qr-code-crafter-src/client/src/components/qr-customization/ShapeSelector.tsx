import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ShapeOption<T extends string> {
  value: T;
  label: string;
  icon: React.ReactNode;
}

interface ShapeSelectorProps<T extends string> {
  options: ShapeOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function ShapeSelector<T extends string>({
  options,
  value,
  onChange,
  className,
}: ShapeSelectorProps<T>) {
  return (
    <TooltipProvider delayDuration={200}>
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={(v) => v && onChange(v as T)}
        className={cn("flex flex-wrap gap-1", className)}
      >
        {options.map((option) => (
          <Tooltip key={option.value}>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value={option.value}
                aria-label={option.label}
                className={cn(
                  "w-9 h-9 p-0 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                )}
              >
                {option.icon}
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              {option.label}
            </TooltipContent>
          </Tooltip>
        ))}
      </ToggleGroup>
    </TooltipProvider>
  );
}
