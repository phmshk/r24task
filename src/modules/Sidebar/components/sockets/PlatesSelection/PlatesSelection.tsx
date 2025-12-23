import type { Plate } from "@/shared/types";
import { cn } from "@/shared/utils";

interface PlatesSelectionProps {
  plates: Plate[];
  setSelectedPlateId: (id: string) => void;
  activePlate: Plate;
}

export const PlatesSelection = (props: PlatesSelectionProps) => {
  const { plates, setSelectedPlateId, activePlate } = props;
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">
        Wähle die Rückwand für die Steckdose
      </h3>
      <div className="bg-card flex gap-2 overflow-x-scroll rounded-md p-2 pb-4">
        {plates.map((plate) => (
          <div className="flex flex-col items-center" key={plate.id}>
            {/*Outer div for plate*/}
            <div
              onClick={() => setSelectedPlateId(plate.id)}
              className={cn(
                "flex h-36 w-32 cursor-pointer items-center justify-center rounded-md border-2",
                activePlate.id === plate.id ? "bg-green-50" : "bg-white",
              )}
            >
              {/*Plate item representing a real plate*/}
              <div
                className={cn(
                  "max-h-[70%] max-w-[80%] rounded-md border",
                  activePlate.id === plate.id
                    ? "border-green-500 bg-green-50"
                    : "bg-card",
                )}
                style={{
                  aspectRatio: `${plate.width} / ${plate.height}`,
                  width: "100%",
                }}
              ></div>
            </div>
            <span className="text-sm font-light">
              {plate.width} x {plate.height} cm
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
