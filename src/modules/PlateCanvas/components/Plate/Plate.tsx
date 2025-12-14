import type { Plate as PlateType } from "@/shared/types";

interface IPlate {
  plate: PlateType;
  xPosition: number;
  maxHeight: number;
}

export const Plate = (props: IPlate) => {
  const { plate, xPosition, maxHeight } = props;

  return (
    <rect
      key={plate.id}
      x={xPosition}
      y={maxHeight - plate.height}
      width={plate.width}
      height={plate.height}
      className="fill-white"
    />
  );
};
