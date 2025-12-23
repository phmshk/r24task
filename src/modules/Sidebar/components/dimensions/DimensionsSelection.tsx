import { Button } from "@/shared/components/ui/button";
import type { Plate as PlateType } from "@/shared/types";
import { Plus } from "lucide-react";
import { PlateDimensions } from "./PlateDimensions/PlateDimensions";

interface DimensionsSelectionProps {
  plates: PlateType[];
  activePlate: PlateType;
  setSelectedPlateId: (id: string) => void;
  deletePlate: (id: string) => void;
  resizePlate: (id: string, width: number, height: number) => void;
  addPlate: () => string;
}

export const DimensionsSelection = (props: DimensionsSelectionProps) => {
  const {
    plates,
    activePlate,
    setSelectedPlateId,
    deletePlate,
    resizePlate,
    addPlate,
  } = props;
  return (
    <div className="flex w-full flex-col gap-8">
      <h2 className="text-2xl font-normal">
        <span className="font-bold">Maße.</span> Eingeben.
      </h2>
      {plates.map((plate, index) => (
        <div
          tabIndex={0}
          onFocus={() => setSelectedPlateId(plate.id)}
          onClick={() => setSelectedPlateId(plate.id)}
          key={plate.id}
        >
          <PlateDimensions
            count={index + 1}
            plate={plate}
            isSelected={activePlate.id === plate.id}
            onDelete={() => deletePlate(plate.id)}
            onDimensionsChange={(width: number, height: number) =>
              resizePlate(plate.id, width, height)
            }
            lastPlate={plates.length === 1}
          />
        </div>
      ))}
      <Button
        variant="outlineSuccess"
        className="flex h-12 w-fit cursor-pointer items-center text-base font-normal md:self-end"
        onClick={() => {
          const id = addPlate();
          setSelectedPlateId(id);
        }}
      >
        Rückwand hinzufügen
        <Plus />
      </Button>
    </div>
  );
};
