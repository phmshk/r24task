import { useProjectContext } from "@/app/providers";
import { MobileSteps } from "./MobileSteps";
import type { StepConfig } from "./useSidebarSteps";

interface SidebarMobileProps {
  steps: StepConfig[];
}

export const SidebarMobile = ({ steps }: SidebarMobileProps) => {
  const { activeStep, setActiveStep } = useProjectContext();

  const currentIndex = steps.findIndex((s) => s.value === activeStep);
  const safeIndex = currentIndex === -1 ? 0 : currentIndex;
  const currentStep = steps[safeIndex];

  const goToNext = () => {
    if (safeIndex < steps.length - 1) setActiveStep(steps[safeIndex + 1].value);
  };

  const goToPrev = () => {
    if (safeIndex > 0) setActiveStep(steps[safeIndex - 1].value);
  };

  return (
    <div className="relative flex flex-col gap-4">
      <MobileSteps
        currentStep={safeIndex + 1}
        totalSteps={steps.length}
        canPrev={safeIndex > 0}
        canNext={safeIndex < steps.length - 1}
        onPrev={goToPrev}
        onNext={goToNext}
      />

      {currentStep.component}
    </div>
  );
};
