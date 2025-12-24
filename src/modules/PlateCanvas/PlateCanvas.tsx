import { useProjectContext } from "@/app/providers";
import {
  GAP_BETWEEN_PLATES,
  PLATE_SIZE_TEXT_GAP,
  PLATE_SIZE_TEXT_HEIGHT,
} from "@/shared/constants";
import type { Plate as PlateType } from "@/shared/types";
import { useMemo } from "react";
import { Plate } from "./components/Plate/Plate";

export const PlateCanvas = () => {
  const { plates, activeStep, selectedPlateId, selectedSocketGroupId } =
    useProjectContext();

  const activePlate = useMemo(
    () => plates.find((p) => p.id === selectedPlateId) || plates[0],
    [plates, selectedPlateId],
  );

  const layout = useMemo(() => {
    if (activeStep === "dimensions") {
      let totalWidth = 0;
      let maxHeight = 0;
      const platesWithXCoordinate: { plate: PlateType; xPosition: number }[] =
        [];

      plates.forEach((plate: PlateType) => {
        platesWithXCoordinate.push({ plate, xPosition: totalWidth });
        totalWidth += plate.width + GAP_BETWEEN_PLATES;
        maxHeight = maxHeight > plate.height ? maxHeight : plate.height;
      });

      totalWidth = totalWidth > 0 ? totalWidth - GAP_BETWEEN_PLATES : 0;

      return {
        totalWidth,
        maxHeight,
        platesWithXCoordinate,

        visiblePlates: platesWithXCoordinate, // Переименовал для ясности
        viewBox: `0 0 ${totalWidth} ${maxHeight + PLATE_SIZE_TEXT_HEIGHT + PLATE_SIZE_TEXT_GAP}`,
      };
    } else {
      return {
        totalWidth: activePlate.width,
        maxHeight: activePlate.height,
        visiblePlates: [{ plate: activePlate, xPosition: 0 }],
        viewBox: `0 0 ${activePlate.width} ${activePlate.height + PLATE_SIZE_TEXT_HEIGHT + PLATE_SIZE_TEXT_GAP}`,
      };
    }
  }, [plates, activePlate, activeStep]);

  return (
    <div className="flex h-full w-full items-center justify-center p-8 md:p-12">
      <svg
        //viewBox={`0 0 ${layout.totalWidth} ${layout.maxHeight + PLATE_SIZE_TEXT_HEIGHT + PLATE_SIZE_TEXT_GAP}`}
        viewBox={layout.viewBox}
        className="max-h-full max-w-full touch-none"
        // guide from https://www.digitalocean.com/community/tutorials/svg-preserve-aspect-ratio
        // preserveAspectRatio will tell our image to scale to fit the viewPort and to be centered
        // xMidYMid - center the viewBox region within the viewPort region
        // meet - scale our graphic until it meets the height and width of our viewPort
        preserveAspectRatio="xMidYMid meet"
      >
        {layout.visiblePlates.map(({ plate, xPosition }) => (
          <g key={plate.id} className="touch-none">
            <Plate
              plate={plate}
              xPosition={xPosition}
              maxHeight={layout.maxHeight}
              selectedSocketGroupId={selectedSocketGroupId}
            />
            <text
              x={xPosition + plate.width / 2}
              y={layout.maxHeight + PLATE_SIZE_TEXT_GAP}
              fill="white"
              textAnchor="middle"
              dominantBaseline="hanging"
              fontSize={PLATE_SIZE_TEXT_HEIGHT}
              className="pointer-events-none select-none"
            >
              {`${plate.width} x ${plate.height} cm`}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};
