import type { Plate as PlateType } from "@/shared/types";
import { SocketGroup } from "../SocketGroup/SocketGroup";

interface IPlate {
  plate: PlateType;
  xPosition: number;
  maxHeight: number;
}

export const Plate = (props: IPlate) => {
  const { plate, xPosition, maxHeight } = props;

  return (
    <svg
      width={plate.width}
      height={plate.height}
      x={xPosition}
      y={maxHeight - plate.height}
      viewBox={`0 0 ${plate.width} ${plate.height}`}
      className="plate"
    >
      <rect width="100%" height="100%" className="fill-white" />
      <SocketGroup
        socketGroup={plate.socketGroups[0]}
        plateId={plate.id}
        plateWidth={plate.width}
        plateHeight={plate.height}
        allGroups={plate.socketGroups}
      />
    </svg>
  );
};
