import { cn } from "@/shared/utils";
import type { ReactNode } from "react";

interface SidebarStepProps {
  isActive: boolean;
  isLast?: boolean;
  children: ReactNode;
  onClick?: () => void;
  count: number;
}

export const SidebarStep = (props: SidebarStepProps) => {
  const { isActive, isLast, children, onClick, count } = props;

  return (
    <div
      className={cn(
        "group flex gap-4 transition-opacity duration-500 ease-in-out",
        isActive ? "opacity-100" : "opacity-30 hover:opacity-60",
      )}
      onClick={onClick}
    >
      {/* Left side */}
      <div className="flex flex-col items-center pt-2">
        <div
          className={cn(
            "z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 text-base transition-colors duration-300",
            isActive
              ? "border-primary bg-primary text-primary-foreground shadow-sm"
              : "border-muted-foreground/40 bg-secondary text-secondary-foreground",
          )}
        >
          {count}
        </div>
        {!isLast && <div className="bg-border my-1 min-h-0.5 w-0.5 flex-1" />}
      </div>

      {/* Right side */}
      <div
        className={cn(
          "min-w-0 flex-1 pb-12",
          isLast && "pb-0",
          !isActive && "pointer-events-none",
        )}
      >
        {children}
      </div>
    </div>
  );
};
