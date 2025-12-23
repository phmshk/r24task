import { SOCKET_MARGIN_FROM_EDGE } from "@/shared/constants";

interface PlateMarginsProps {
  width: number;
  height: number;
}

export const PlateMargins = ({ width, height }: PlateMarginsProps) => {
  return (
    <rect
      x={SOCKET_MARGIN_FROM_EDGE}
      y={SOCKET_MARGIN_FROM_EDGE}
      width={width - SOCKET_MARGIN_FROM_EDGE * 2}
      height={height - SOCKET_MARGIN_FROM_EDGE * 2}
      stroke="red"
      strokeWidth="1"
      strokeDasharray="4 6"
      fill="transparent"
      className="pointer-events-none"
      vectorEffect="non-scaling-stroke"
    />
  );
};
