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
    >
      <rect width="100%" height="100%" className="fill-white" />
      {plate.socketGroups.map((item) => (
        <SocketGroup
          key={item.id}
          socketGroup={item}
          plateId={plate.id}
          plateWidth={plate.width}
          plateHeight={plate.height}
          allGroups={plate.socketGroups}
        />
      ))}
    </svg>
  );
};
