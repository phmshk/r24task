import { useProjectContext } from "@/app/providers";
import { GAP_BETWEEN_PLATES } from "@/shared/constants";
import type { Plate } from "@/shared/types";
import { useMemo } from "react";
import { Plate as PlateItem } from "./components/Plate/Plate.tsx";

export const PlateCanvas = () => {
  const { plates } = useProjectContext();

  const layout = useMemo(() => {
    let totalWidth = 0;
    let maxHeight = 0;
    const platesWithXCoordinate: { plate: Plate; xPosition: number }[] = [];

    plates.forEach((plate: Plate) => {
      platesWithXCoordinate.push({ plate, xPosition: totalWidth });
      totalWidth += plate.width + GAP_BETWEEN_PLATES;
      maxHeight = maxHeight > plate.height ? maxHeight : plate.height;
    });

    totalWidth = totalWidth > 0 ? totalWidth - GAP_BETWEEN_PLATES : 0;

    return {
      totalWidth,
      maxHeight,
      platesWithXCoordinate,
    };
  }, [plates]);

  return (
    <svg
      viewBox={`0 0 ${layout.totalWidth} ${layout.maxHeight}`}
      className="max-h-full max-w-full drop-shadow-xl transition-all duration-300 ease-in-out"
      // guide from https://www.digitalocean.com/community/tutorials/svg-preserve-aspect-ratio
      // preserveAspectRatio will tell our image to scale to fit the viewPort and to be centered
      // xMidYMid - center the viewBox region within the viewPort region
      // meet - scale our graphic until it meets the height and width of our viewPort
      preserveAspectRatio="xMidYMid meet"
    >
      {layout.platesWithXCoordinate.map(({ plate, xPosition }) => (
        <PlateItem
          key={plate.id}
          plate={plate}
          xPosition={xPosition}
          maxHeight={layout.maxHeight}
        />
      ))}
    </svg>
  );
};
