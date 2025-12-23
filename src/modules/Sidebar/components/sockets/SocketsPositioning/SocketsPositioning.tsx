import { X } from "lucide-react";
import { PositioningInput } from "./PositioningInput";
import type { Plate, SocketGroup } from "@/shared/types";
import { Button } from "@/shared/components/ui/button";

interface SocketsPositioningProps {
  plate: Plate;
  activeSocketGroup: SocketGroup;
  onAddSocket: () => void;
  updateSocketGroup: (data: Partial<SocketGroup>) => void;
}

export const SocketsPositioning = (props: SocketsPositioningProps) => {
  const { plate, activeSocketGroup, onAddSocket, updateSocketGroup } = props;

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-xl font-bold">Positioniere die Steckdose</h3>
      <div className="bg-card relative flex w-full items-center justify-between gap-2 rounded-md px-4 py-6 md:gap-4">
        <div>
          <h4 className="text-base font-medium">Abstand von links</h4>
          <PositioningInput
            limit={plate.width}
            defaultValue={activeSocketGroup.x}
            onValueChange={(val) => updateSocketGroup({ x: val })}
          />
        </div>
        <X className="mt-6 size-6" />
        <div>
          <h4 className="text-base font-medium">Abstand von unten</h4>
          <PositioningInput
            limit={plate.height}
            defaultValue={activeSocketGroup.y}
            onValueChange={(val) => updateSocketGroup({ y: val })}
            inverted
          />
        </div>
      </div>

      <Button
        variant="outlineSuccess"
        className="h-12 w-fit cursor-pointer text-base font-normal md:self-end"
        onClick={onAddSocket}
      >
        Steckdose bestätigen
      </Button>
    </div>
  );
};
