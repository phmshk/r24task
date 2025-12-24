import { useEffect, useMemo } from "react";
import { useProjectContext } from "@/app/providers";
import { useIntersectionObserver } from "@/shared/utils";
import { SidebarStep } from "./SidebarStep";
import type { StepConfig } from "./useSidebarSteps";

interface SidebarDesktopProps {
  steps: StepConfig[];
}

export const SidebarDesktop = ({ steps }: SidebarDesktopProps) => {
  const { setActiveStep } = useProjectContext();

  const observerConfig = useMemo(
    () => steps.map((s) => ({ id: s.id, ref: s.ref })),
    [steps],
  );

  const observerOptions = useMemo(
    () => ({
      //active area of the scrol
      //top 20% of the screen is ignored so that the top element is disabled when it moves to the top
      //bottom 35% of the screen is ignored so that the bottom element is activated only when it moves higher
      rootMargin: "-20% 0px -35% 0px",
      //element is visible if at least 10% is visible
      threshold: 0.4,
    }),
    [],
  );

  const { activeId, setActiveId } = useIntersectionObserver(
    observerConfig,
    observerOptions,
  );

  useEffect(() => {
    const visibleStep = steps.find((s) => s.id === activeId);
    if (visibleStep) {
      setActiveStep(visibleStep.value);
    }
  }, [activeId, setActiveStep, steps]);

  const handleScroll = (
    id: string,
    ref: React.RefObject<HTMLDivElement | null>,
  ) => {
    setActiveId(id);
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex min-h-1/3 flex-col gap-4">
      {steps.map((step, index) => (
        <div key={step.id} ref={step.ref} id={step.id}>
          <SidebarStep
            isActive={activeId === step.id}
            isLast={index === steps.length - 1}
            onClick={() => handleScroll(step.id, step.ref)}
            count={index + 1}
          >
            {step.component}
          </SidebarStep>
        </div>
      ))}
    </div>
  );
};
