import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import type { Plate } from "@/shared/types";
import { cn } from "@/shared/utils";

interface PlatesSelectionProps {
  plates: Plate[];
  setSelectedPlateId: (id: string) => void;
  activePlate: Plate;
  isDisabled: boolean;
}

export const PlatesSelection = (props: PlatesSelectionProps) => {
  const { plates, setSelectedPlateId, activePlate, isDisabled } = props;
  return (
    <div className="min-h-1/2 space-y-4">
      <h3 className="text-xl font-bold">
        Wähle die Rückwand für die Steckdose
      </h3>
      <div className="bg-card flex max-w-full gap-2 overflow-x-auto rounded-md p-2 pb-4">
        <TooltipProvider>
          {plates.map((plate) => {
            const isSelected = activePlate.id === plate.id;
            const handleClick = () => {
              if (!isDisabled) {
                setSelectedPlateId(plate.id);
              }
            };
            return (
              <Tooltip key={plate.id} delayDuration={300}>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center">
                    {/*Outer div for plate*/}
                    <div
                      onClick={handleClick}
                      className={cn(
                        "flex h-36 w-32 cursor-pointer items-center justify-center rounded-md border-2",
                        isSelected ? "bg-green-50" : "bg-white",
                        isDisabled ? "cursor-not-allowed" : "cursor-pointer",
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
                </TooltipTrigger>
                {isDisabled && !isSelected && (
                  <TooltipContent>
                    <p>
                      Bitte beende zuerst die Bearbeitung der aktuellen
                      Steckdose.
                    </p>
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </div>
    </div>
  );
};
