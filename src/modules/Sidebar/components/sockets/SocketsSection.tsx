import { Label } from "@/shared/components/ui/label";
import type { Coordinates, Plate, SocketGroup } from "@/shared/types";
import { Switch } from "@/shared/components/ui/switch";
import { useMemo } from "react";
import {
  MIN_PLATE_HEIGHT_FOR_SOCKET,
  MIN_PLATE_WIDTH_FOR_SOCKET,
} from "@/shared/constants";
import { Info } from "lucide-react";
import { PlatesSelection } from "./PlatesSelection/PlatesSelection";
import { SocketsSelection } from "./SocketSelection/SocketSelection";
import { SocketsPositioning } from "./SocketsPositioning/SocketsPositioning";
import { SocketsListView } from "./SocketsListView/SocketsListView";
import { findNextAvailablePosition } from "@/shared/utils";

interface SocketsSectionProps {
  plates: Plate[];
  socketModeIsOn: boolean;
  selectedPlateId: string;
  activePlate: Plate;
  selectedSocketGroupId: string | null;
  setSelectedSocketGroupId: (id: string | null) => void;
  toggleSocketMode: () => { groupId: string; plateId: string } | null;
  updateSocketGroup: (
    plateId: string,
    groupId: string,
    data: Partial<SocketGroup>,
  ) => void;
  addSocketGroup: (plateId: string, socketPosition: Coordinates) => string;
  removeSocketGroup: (plateId: string, groupId: string) => void;
  setSelectedPlateId: (id: string) => void;
}

export const SocketsSection = (props: SocketsSectionProps) => {
  const {
    plates,
    toggleSocketMode,
    addSocketGroup,
    removeSocketGroup,
    updateSocketGroup,
    socketModeIsOn,
    setSelectedPlateId,
    activePlate,
    selectedSocketGroupId,
    setSelectedSocketGroupId,
  } = props;

  const canAddSocketsToAny = useMemo(
    () =>
      plates.some(
        (plate) =>
          plate.height >= MIN_PLATE_HEIGHT_FOR_SOCKET &&
          plate.width >= MIN_PLATE_WIDTH_FOR_SOCKET,
      ),
    [plates],
  );

  const nextAvailablePosition = useMemo(
    () => findNextAvailablePosition(activePlate, 1, "horizontal"),
    [activePlate],
  );

  const activeSocketGroup = useMemo(() => {
    if (!activePlate.socketGroups.length) return undefined;

    return activePlate.socketGroups.find(
      (group) => group.id === selectedSocketGroupId,
    );
  }, [activePlate.socketGroups, selectedSocketGroupId]);

  const handleAddSocketGroup = () => {
    if (nextAvailablePosition) {
      const id = addSocketGroup(activePlate.id, nextAvailablePosition);
      if (id) setSelectedSocketGroupId(id);
    }
  };

  const handleToggleSocketMode = () => {
    const result = toggleSocketMode();
    if (result) {
      setSelectedPlateId(result.plateId);
      setSelectedSocketGroupId(result.groupId);
    }
  };

  const handleSelectSocketGroup = (groupId: string, plateId: string) => {
    setSelectedPlateId(plateId);
    setSelectedSocketGroupId(groupId);
  };

  return (
    <div className="flex w-full flex-col gap-8 lg:min-h-92">
      <h2 className="text-center text-2xl font-normal lg:text-start">
        <span className="font-bold">Steckdosen.</span> Auswählen.
      </h2>
      <div className="border-muted flex items-center justify-between rounded-md border-2 px-2 py-4">
        <Label htmlFor="add-sockets">Ausschnitte für Steckdosen angeben?</Label>
        <Switch
          disabled={!socketModeIsOn && !canAddSocketsToAny}
          checked={socketModeIsOn}
          onCheckedChange={handleToggleSocketMode}
          className="cursor-pointer data-[state=checked]:bg-green-500"
          id="add-sockets"
        />
      </div>
      {!canAddSocketsToAny && (
        <div className="border-destructive text-destructive flex items-start gap-2 rounded-md border px-2 py-4">
          <Info />
          <div>
            <h3>Hinweis</h3>
            <p>
              Für diese Maße sind keine Auschnitte möglich. Das Mindestmaß für
              Steckdosen beträgt 40x40cm. Bitte ändere die Maße entsprechend.
            </p>
          </div>
        </div>
      )}
      {socketModeIsOn && canAddSocketsToAny && (
        <div className="space-y-6">
          {activeSocketGroup ? (
            <div>
              <PlatesSelection
                activePlate={activePlate}
                plates={plates}
                setSelectedPlateId={setSelectedPlateId}
              />

              <SocketsSelection
                plate={activePlate}
                updateSocketGroup={updateSocketGroup}
                activeSocketGroup={activeSocketGroup}
              />

              <SocketsPositioning
                plate={activePlate}
                updateSocketGroup={(data) =>
                  updateSocketGroup(activePlate.id, activeSocketGroup.id, data)
                }
                activeSocketGroup={activeSocketGroup}
                onAddSocket={() => setSelectedSocketGroupId(null)}
              />
            </div>
          ) : (
            <SocketsListView
              onEdit={handleSelectSocketGroup}
              onAdd={handleAddSocketGroup}
              onDelete={(groupId: string, plateId: string) =>
                removeSocketGroup(plateId, groupId)
              }
              canAddMore={!!nextAvailablePosition}
              onSelect={handleSelectSocketGroup}
              plates={plates}
            />
          )}
        </div>
      )}
    </div>
  );
};
