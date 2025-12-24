import type { Plate, SocketGroup } from "@/shared/types";
import { SocketGroupSettings } from "./SocketGroupSettings";
import type { CountType, OrientationType } from "@/shared/types/types";
import { canPlaceGroup } from "@/shared/utils";

interface SocketsSelectionProps {
  plate: Plate;
  activeSocketGroup: SocketGroup;
  updateSocketGroup: (
    plateId: string,
    groupId: string,
    data: Partial<SocketGroup>,
  ) => void;
}

export const SocketsSelection = (props: SocketsSelectionProps) => {
  const { plate, updateSocketGroup, activeSocketGroup } = props;

  const currentGroup = plate.socketGroups.find(
    (group) => group.id === activeSocketGroup.id,
  );

  if (!currentGroup) return null;

  const isGroupSizeValid = (countStr: string) => {
    const newCount = parseInt(countStr, 10) as CountType;
    if (newCount === currentGroup.count) return true;

    const testGroup = { ...currentGroup, count: newCount };

    return canPlaceGroup(testGroup, plate, currentGroup.id);
  };

  const isGroupOrientationValid = (orientationStr: string): boolean => {
    const newOrientation =
      orientationStr === "Horizontal" ? "horizontal" : "vertical";
    if (newOrientation === currentGroup.orientation) return true;

    const testGroup: SocketGroup = {
      ...currentGroup,
      orientation: newOrientation,
    };

    return canPlaceGroup(testGroup, plate, currentGroup.id);
  };

  const handleCountChange = (val: string) => {
    const newCount = parseInt(val, 10) as CountType;

    updateSocketGroup(plate.id, currentGroup.id, {
      ...currentGroup,
      count: newCount,
    });
  };

  const handleOrientationChange = (val: string) => {
    const newOrientation: OrientationType =
      val === "Horizontal" ? "horizontal" : "vertical";
    updateSocketGroup(plate.id, currentGroup.id, {
      ...currentGroup,
      orientation: newOrientation,
    });
  };

  const countItems = ["1", "2", "3", "4", "5"];
  const orientationItems = ["Horizontal", "Vertikal"];

  return (
    <div className="min-h-1/2 space-y-4">
      <h3 className="text-xl font-bold">
        Bestimme Anzahl und Ausrichtung der Steckdosen
      </h3>
      <div className="bg-card flex w-full items-center justify-between rounded-md px-2 py-4">
        <div className="flex w-full flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
          <SocketGroupSettings
            title="Anzahl"
            items={countItems}
            variant="outlineNumber"
            value={currentGroup.count.toString()}
            onChange={handleCountChange}
            disabledItems={countItems.filter((item) => !isGroupSizeValid(item))}
          />
          <SocketGroupSettings
            title="Steckdosen-Ausrichtung"
            items={orientationItems}
            variant="outlineOrientation"
            value={
              currentGroup.orientation === "horizontal"
                ? "Horizontal"
                : "Vertikal"
            }
            onChange={handleOrientationChange}
            disabledItems={orientationItems.filter(
              (item) => !isGroupOrientationValid(item),
            )}
          />
        </div>
      </div>
    </div>
  );
};
