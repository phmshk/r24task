import { useMemo } from "react";
import type { Plate } from "@/shared/types";
import {
  GAP_BETWEEN_PLATES,
  PLATE_SIZE_TEXT_GAP,
  PLATE_SIZE_TEXT_HEIGHT,
} from "@/shared/constants";

interface UseCanvasLayoutParams {
  plates: Plate[];
  activeStep: string;
  activePlate: Plate;
}

export const useCanvasLayout = ({
  plates,
  activeStep,
  activePlate,
}: UseCanvasLayoutParams) => {
  return useMemo(() => {
    if (activeStep === "dimensions") {
      let totalWidth = 0;
      let maxHeight = 0;
      const visiblePlates: { plate: Plate; xPosition: number }[] = [];

      plates.forEach((plate) => {
        visiblePlates.push({ plate, xPosition: totalWidth });
        totalWidth += plate.width + GAP_BETWEEN_PLATES;
        maxHeight = Math.max(maxHeight, plate.height);
      });

      totalWidth = totalWidth > 0 ? totalWidth - GAP_BETWEEN_PLATES : 0;

      return {
        totalWidth,
        maxHeight,
        visiblePlates,
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
};
