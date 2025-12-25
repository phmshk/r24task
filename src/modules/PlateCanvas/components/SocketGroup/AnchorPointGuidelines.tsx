import type { SocketGroupInfo } from "@/shared/types";
import { PLATE_SIZE_TEXT_HEIGHT, SOCKET_SIZE } from "@/shared/constants";

interface AnchorPointGuidelinesProps {
  currGroup: SocketGroupInfo;
  plateHeight: number;
}
export function AnchorPointGuidelnes(props: AnchorPointGuidelinesProps) {
  const { currGroup, plateHeight } = props;
  return (
    <g className="pointer-events-none">
      {/*HORIZONTAL LINE*/}
      <line
        x1={currGroup.anchorPoint.x}
        x2={currGroup.anchorPoint.x}
        y1={plateHeight}
        y2={currGroup.anchorPoint.y}
        stroke="black"
        strokeDasharray="2"
        strokeWidth={0.2}
      />
      <text
        x={currGroup.anchorPoint.x / 2}
        y={currGroup.anchorPoint.y + SOCKET_SIZE / 2}
        textAnchor="middle"
        fontSize={PLATE_SIZE_TEXT_HEIGHT}
        fill="red"
      >
        {currGroup.anchorPoint.x.toFixed(1)} cm
      </text>
      {/* VERTICAL LINE*/}
      <line
        x1={0}
        x2={currGroup.anchorPoint.x}
        y1={currGroup.anchorPoint.y}
        y2={currGroup.anchorPoint.y}
        stroke="black"
        strokeDasharray="2"
        strokeWidth={0.2}
      />

      <text
        x={currGroup.anchorPoint.x + SOCKET_SIZE}
        y={(currGroup.anchorPoint.y + plateHeight) / 2}
        textAnchor="middle"
        fontSize={PLATE_SIZE_TEXT_HEIGHT}
        fill="red"
      >
        {(plateHeight - currGroup.anchorPoint.y).toFixed(1)} cm
      </text>

      <circle
        cx={currGroup.anchorPoint.x}
        cy={currGroup.anchorPoint.y}
        r={0.5}
        fill="red"
      />
    </g>
  );
}
