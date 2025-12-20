import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/utils";
import { useState } from "react";
import { dimensionSchema } from "./dimensionsSchema";

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

  const [value, setValue] = useState<string>(defaultValue.toString());

  const label = dimension === "width" ? "Breite" : "Höhe";

  const schema = dimensionSchema(min, max, label);
  const result = schema.safeParse(value);

  let parsedValue = Number(value);

  if (result.success) {
    parsedValue = result.data;
  }

  const clampToRange = (value: number) => {
    return parseFloat(Math.max(min, Math.min(value, max)).toFixed(1));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    setValue(rawValue);

    const parsedResult = schema.safeParse(rawValue);

    if (parsedResult.success) {
      onValueChange(parsedResult.data);
    }
  };

  const handleBlur = () => {
    const clampedValue = clampToRange(parsedValue);
    setValue(clampedValue.toString());
    if (clampedValue !== defaultValue) {
      onValueChange(clampedValue);
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-2">
      {isSelected && (
        <div className="flex w-full items-baseline justify-around">
          <span className="text-base font-medium">{label}</span>
          <span className="text-xs font-medium">
            {min} - {max} cm
          </span>
        </div>
      )}

      <div className="relative w-full">
        <Input
          type="number"
          className={cn(
            "no-input-arrows h-12 bg-white pr-10 text-center font-bold md:max-w-60",
            isSelected ? "text-xl md:text-2xl" : "text-md md:text-xl",
            !result.success &&
              "bg-destructive/10 focus-visible:border-destructive focus-visible:ring-destructive/10",
          )}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
          }}
        />
        <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sm">
          cm
        </span>
      </div>
      {isSelected && <span>{(parsedValue * 10).toFixed(0)} mm</span>}
      {/* Positioned relative to the whole PlateDimensions component*/}
      {!result.success && (
        <div className="bg-destructive/70 absolute -top-0.5 left-1/2 w-fit -translate-x-1/2 rounded-md px-4 text-center text-sm font-extralight whitespace-nowrap text-white">
          {result.error.issues[0].message}
        </div>
      )}
    </div>
  );
};
