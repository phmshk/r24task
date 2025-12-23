import { z } from "zod";

export const dimensionSchema = (min: number, max: number, label: string) =>
  z.coerce
    .number()
    .min(min, {
      message: `Die ${label} muss zwischen ${min} und ${max} cm liegen`,
    })
    .max(max, {
      message: `Die ${label} muss zwischen ${min} und ${max} cm liegen`,
    })
    .refine(
      (n) => {
        const decimalPart = n.toString().split(".")[1];
        return !decimalPart || decimalPart.length < 2;
      },
      { message: `Die ${label} darf nur eine Nachkommastelle haben` },
    );
