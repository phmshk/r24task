import {
  PLATE_SIZE_TEXT_GAP,
  PLATE_SIZE_TEXT_HEIGHT,
} from "@/shared/constants";

interface DimensionLabelProps {
  x: number;
  yBase: number;
  width: number;
  height: number;
}

export const DimensionLabel = ({
  x,
  yBase,
  width,
  height,
}: DimensionLabelProps) => {
  return (
    <text
      x={x}
      y={yBase + PLATE_SIZE_TEXT_GAP}
      fill="white"
      textAnchor="middle"
      dominantBaseline="hanging"
      fontSize={PLATE_SIZE_TEXT_HEIGHT}
      className="pointer-events-none font-medium select-none"
    >
      {`${width} x ${height} cm`}
    </text>
  );
};
