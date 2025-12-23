import { useState, useEffect } from "react";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/utils";
import { z } from "zod";

interface ValidatedNumberInputProps {
  value: number;
  onValueChange: (val: number) => void;
  schema: z.ZodSchema<number>;
  min: number;
  max: number;
  suffix?: string;
  className?: string;
}

export const ValidatedNumberInput = (props: ValidatedNumberInputProps) => {
  const {
    value,
    onValueChange,
    schema,
    min,
    max,
    suffix = "cm",
    className,
  } = props;

  const [localValue, setLocalValue] = useState<string>(value.toString());

  useEffect(() => {
    setLocalValue(value.toString());
  }, [value]);

  const validationResult = schema.safeParse(localValue);

  const clampToRange = (val: number) => {
    return parseFloat(Math.max(min, Math.min(val, max)).toFixed(1));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    setLocalValue(rawValue);

    const parsed = schema.safeParse(rawValue);
    if (parsed.success) {
      onValueChange(parsed.data);
    }
  };

  const handleBlur = () => {
    const numericVal = parseFloat(localValue);

    if (isNaN(numericVal)) {
      setLocalValue(value.toString());
      return;
    }

    const clamped = clampToRange(numericVal);
    setLocalValue(clamped.toString());

    if (clamped !== value) {
      onValueChange(clamped);
    }
  };

  return (
    <div>
      <div className="relative w-full">
        <Input
          type="number"
          className={cn(
            "no-input-arrows h-12 bg-white pr-10 text-center text-xl font-bold md:text-2xl",
            !validationResult.success &&
              "bg-destructive/10 focus-visible:border-destructive focus-visible:ring-destructive/10",
            className,
          )}
          value={localValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
          }}
        />
        {suffix && (
          <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sm">
            {suffix}
          </span>
        )}
      </div>
      {/* position absolute is referred to the whole element containing this input*/}
      {!validationResult.success && (
        <div className="bg-destructive/70 pointer-events-none absolute -top-0.5 left-1/2 z-10 w-fit -translate-x-1/2 rounded-md px-4 text-center text-sm font-extralight whitespace-nowrap text-white">
          {validationResult.error.issues[0].message}
        </div>
      )}
    </div>
  );
};
