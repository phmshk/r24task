import { z } from "zod";

export const socketsPositioningSchema = (min: number, max: number) =>
  z.coerce
    .number()
    .min(min, {
      message: `Der Abstand zu den äußeren Seiten muss min. ${min} cm betragen.`,
    })
    .max(max, {
      message: `Der Abstand zu den äußeren Seiten muss min. ${min} cm betragen.`,
    })
    .refine(
      (n) => {
        const decimalPart = n.toString().split(".")[1];
        return !decimalPart || decimalPart.length < 2;
      },
      { message: `Der Abstand darf nur eine Nachkommastelle haben` },
    );
