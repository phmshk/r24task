import { useMemo } from "react";
import { useProjectContext } from "@/app/providers";
import { Plate } from "./components/Plate/Plate";
import { useCanvasLayout } from "./hooks/useCanvasLayout";
import { CanvasNavigation } from "./components/Canvas/CanvasNavigation/CanvasNavigation";
import { DimensionLabel } from "./components/Canvas/DimensionsLabel/DimensionsLabel";

export const PlateCanvas = () => {
  const {
    plates,
    activeStep,
    selectedPlateId,
    selectedSocketGroupId,
    setSelectedPlateId,
  } = useProjectContext();

  const activePlate = useMemo(
    () => plates.find((p) => p.id === selectedPlateId) || plates[0],
    [plates, selectedPlateId],
  );

  const layout = useCanvasLayout({ plates, activeStep, activePlate });

  const currentPlateIndex = plates.findIndex((p) => p.id === activePlate.id);
  const showNavigation = activeStep !== "dimensions" && plates.length > 1;
  const showDimensions = activeStep !== "dimensions";

  const handlePrevPlate = () => {
    const prevIndex = currentPlateIndex - 1;
    if (prevIndex >= 0) setSelectedPlateId(plates[prevIndex].id);
  };

  const handleNextPlate = () => {
    const nextIndex = currentPlateIndex + 1;
    if (nextIndex < plates.length) setSelectedPlateId(plates[nextIndex].id);
  };

  return (
    <div className="relative flex h-full w-full items-center justify-center p-8 md:p-12">
      {showNavigation && (
        <CanvasNavigation
          onPrev={handlePrevPlate}
          onNext={handleNextPlate}
          canPrev={currentPlateIndex > 0}
          canNext={currentPlateIndex < plates.length - 1}
        />
      )}

      <svg
        viewBox={layout.viewBox}
        className="max-h-full max-w-full touch-none overflow-visible"
        preserveAspectRatio="xMidYMid meet"
      >
        {layout.visiblePlates.map(({ plate, xPosition }) => (
          <g key={plate.id} className="touch-none overflow-visible">
            <Plate
              plate={plate}
              xPosition={xPosition}
              maxHeight={layout.maxHeight}
              selectedSocketGroupId={selectedSocketGroupId}
            />
            {showDimensions && (
              <DimensionLabel
                x={xPosition + plate.width / 2}
                yBase={layout.maxHeight}
                width={plate.width}
                height={plate.height}
              />
            )}
          </g>
        ))}
      </svg>
    </div>
  );
};
