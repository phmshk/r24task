import { Button } from "@/shared/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/shared/utils";

interface MobileStepsProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  canNext: boolean;
  canPrev: boolean;
}

export const MobileSteps = (props: MobileStepsProps) => {
  const { currentStep, totalSteps, onNext, onPrev, canNext, canPrev } = props;

  return (
    <div className="bg-background flex w-full items-center justify-between border p-4 shadow-md">
      <Button
        variant="outline"
        size="icon"
        onClick={onPrev}
        disabled={!canPrev}
        className={cn(
          "rounded-full transition-opacity",
          !canPrev ? "pointer-events-none opacity-0" : "opacity-100",
        )}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <div className="flex flex-col items-center justify-center gap-1">
        <div className="border-foreground rounded-xl border-2 px-4 py-2 text-sm font-bold">
          {currentStep} / {totalSteps}
        </div>
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={onNext}
        disabled={!canNext}
        className={cn(
          "rounded-full transition-opacity",
          !canNext ? "pointer-events-none opacity-0" : "opacity-100",
        )}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
    </div>
  );
};
