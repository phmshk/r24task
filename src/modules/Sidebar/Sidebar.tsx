import { useProjectContext } from "@/app/providers";
import { Button } from "@/shared/components/ui/button";
import { PlateDimensions } from "./components/PlateDimensions/PlateDimensions";
import { Plus } from "lucide-react";
import { useState } from "react";

export const Sidebar = () => {
  const {
    addPlate,
    deletePlate,
    plates,
    resizePlate,
    toggleSocketMode,
    updateSocketGroup,
  } = useProjectContext();
  const [selectedPlateId, setSelectedPlateId] = useState<string>(plates[0].id);

  const activePlate =
    plates.find((plate) => plate.id === selectedPlateId) || plates[0];

  return (
    <>
      <h1 className="text-center text-2xl font-bold">Sidebar</h1>
      <div className="flex w-full flex-col gap-8">
        {plates.map((plate, index) => (
          <div onClick={() => setSelectedPlateId(plate.id)} key={plate.id}>
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
          className="h-12 cursor-pointer text-base font-normal md:w-1/2 md:self-end"
          onClick={() => {
            const id = addPlate();
            setSelectedPlateId(id);
          }}
        >
          Rückwand hinzufügen
          <Plus />
        </Button>
      </div>
    </>
  );
};
