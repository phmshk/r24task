import { cn } from "@/shared/utils";
import { dimensionSchema } from "./dimensionsSchema";
import { ValidatedNumberInput } from "@/modules/Sidebar/components/shared/ValidatedNumberInput";

interface DimensionsInputProps {
  dimension: "height" | "width";
  defaultValue: number;
  min: number;
  max: number;
  isSelected: boolean;
  onValueChange: (value: number) => void;
}

export const DimensionInput = (props: DimensionsInputProps) => {
  const { dimension, isSelected, min, max, defaultValue, onValueChange } =
    props;

  const label = dimension === "width" ? "Breite" : "Höhe";
  const schema = dimensionSchema(min, max, label);

  return (
    <div className="flex w-full flex-col items-center gap-2">
      {isSelected && (
        <div className="flex w-full items-baseline justify-around">
          <span className="text-sm font-medium lg:text-base">{label}</span>
          <span className="text-xs font-medium">
            {min} - {max} cm
          </span>
        </div>
      )}

      <ValidatedNumberInput
        onValueChange={onValueChange}
        max={max}
        min={min}
        schema={schema}
        value={defaultValue}
        className={cn(
          "md:max-w-60",
          isSelected ? "text-base md:text-xl" : "text-sm md:text-base",
        )}
      />

      {isSelected && <span>{(defaultValue * 10).toFixed(0)} mm</span>}
    </div>
  );
};
