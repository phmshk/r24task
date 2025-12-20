import { Button } from "@/shared/components/ui/button";
import {
  MAX_PLATE_HEIGHT,
  MAX_PLATE_WIDTH,
  MIN_PLATE_HEIGHT,
  MIN_PLATE_WIDTH,
} from "@/shared/constants";
import type { Plate } from "@/shared/types";
import { Minus, X } from "lucide-react";
import { DimensionInput } from "./DimensionsInput";
import { cn } from "@/shared/utils";

interface IPlateDimensions {
  plate: Plate;
  count: number;
  isSelected: boolean;
  onDelete: () => void;
  lastPlate: boolean;
  onDimensionsChange: (width: number, height: number) => void;
}

export const PlateDimensions = (props: IPlateDimensions) => {
  const { plate, count, isSelected, onDelete, lastPlate, onDimensionsChange } =
    props;

  const countClasses = isSelected
    ? "bg-primary text-primary-foreground"
    : "bg-secondary text-secondary-foreground";

  return (
    <div className="bg-card relative flex w-full items-center justify-between gap-2 rounded-md px-4 py-6 md:gap-4">
      {/*<div
        className={cn(
          "border-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-md border-2 text-xl",
          countClasses,
        )}
      >
        {count}
      </div>*/}
      <DimensionInput
        dimension="width"
        isSelected={isSelected}
        max={MAX_PLATE_WIDTH}
        min={MIN_PLATE_WIDTH}
        defaultValue={plate.width}
        onValueChange={(newWidth) => onDimensionsChange(newWidth, plate.height)}
      />
      <X className="size-10" />
      <DimensionInput
        dimension="height"
        isSelected={isSelected}
        max={MAX_PLATE_HEIGHT}
        min={MIN_PLATE_HEIGHT}
        defaultValue={plate.height}
        onValueChange={(newHeight) =>
          onDimensionsChange(plate.width, newHeight)
        }
      />
      {/*!lastPlate && (
        <Button
          variant="destructiveCircle"
          size="icon-sm"
          className="shrink-0 cursor-pointer"
          onClick={onDelete}
        >
          <Minus />
        </Button>
      )*/}
    </div>
  );
};
