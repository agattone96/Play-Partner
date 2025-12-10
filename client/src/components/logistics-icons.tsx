import { Home, Car, EyeOff, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LogisticsIconsProps {
  hosting?: boolean;
  car?: boolean;
  discreet?: boolean;
  hasPhone?: boolean;
  className?: string;
}

export function LogisticsIcons({
  hosting,
  car,
  discreet,
  hasPhone,
  className,
}: LogisticsIconsProps) {
  const icons = [
    { show: hosting, icon: Home, label: "Can Host", testId: "icon-hosting" },
    { show: car, icon: Car, label: "Has Car", testId: "icon-car" },
    { show: discreet, icon: EyeOff, label: "Discreet/DL", testId: "icon-discreet" },
    { show: hasPhone, icon: Phone, label: "Phone Available", testId: "icon-phone" },
  ];

  const visibleIcons = icons.filter((i) => i.show);

  if (visibleIcons.length === 0) return null;

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      {visibleIcons.map(({ icon: Icon, label, testId }) => (
        <Tooltip key={testId}>
          <TooltipTrigger asChild>
            <span
              className="text-muted-foreground"
              data-testid={testId}
            >
              <Icon className="h-4 w-4" />
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>{label}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
