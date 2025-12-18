import { SOCKET_MARGIN_FROM_EDGE } from "@/shared/constants";

interface IPlateMargins {
  width: number;
  height: number;
}

export const PlateMargins = ({ width, height }: IPlateMargins) => {
  const margin = SOCKET_MARGIN_FROM_EDGE;

  return (
    <rect
      x={margin}
      y={margin}
      width={width - margin * 2}
      height={height - margin * 2}
      stroke="red"
      strokeWidth="1"
      strokeDasharray="4 6"
      fill="transparent"
      className="pointer-events-none"
      vectorEffect="non-scaling-stroke"
    />
  );
};
