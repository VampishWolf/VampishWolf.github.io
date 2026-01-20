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
      <div className={cn("flex flex-wrap gap-1", className)}>
        {options.map((option) => {
          const isSelected = option.value === value;
          return (
            <Tooltip key={option.value}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => onChange(option.value)}
                  aria-label={option.label}
                  className={cn(
                    "w-9 h-9 p-0 rounded-md flex items-center justify-center transition-colors",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-transparent text-foreground hover:bg-muted"
                  )}
                >
                  {option.icon}
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                {option.label}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
