import {
  SOCKET_GAP,
  SOCKET_MARGIN_FROM_EDGE,
  SOCKET_SIZE,
} from "@/shared/constants";
import type { SocketGroup as SocketGroupType } from "@/shared/types";
import { calculateValuesForSocketGroup } from "@/shared/utils";
import { Socket } from "./../Socket/Socket.tsx";
import { useDragNDrop } from "../../hooks/useDragNDrop.ts";
import { useProjectContext } from "@/app/providers/context.ts";

interface ISocketGroup {
  socketGroup: SocketGroupType;
  plateId: string;
  plateHeight: number;
  plateWidth: number;
  allGroups: SocketGroupType[];
}

export const SocketGroup = (props: ISocketGroup) => {
  const { socketGroup, plateId, plateHeight, plateWidth, allGroups } = props;
  const { updateSocketGroup } = useProjectContext();
  const { width, height, coordinates, anchorPoint } =
    calculateValuesForSocketGroup(socketGroup);
  const { isDragging, startDragging } = useDragNDrop({
    initialX: socketGroup.x,
    initialY: socketGroup.y,
    onGroupDrag: (newX: number, newY: number) => {
      const minX = SOCKET_SIZE / 2;
      const minY = height - SOCKET_SIZE / 2;
      const maxX = plateWidth - SOCKET_SIZE / 2;
      const maxY = plateHeight - SOCKET_SIZE / 2;
      const clampedX = Math.max(
        minX + SOCKET_MARGIN_FROM_EDGE,
        Math.min(newX, maxX - SOCKET_MARGIN_FROM_EDGE),
      );
      const clampedY = Math.max(
        minY + SOCKET_MARGIN_FROM_EDGE,
        Math.min(newY, maxY - SOCKET_MARGIN_FROM_EDGE),
      );
      updateSocketGroup(plateId, socketGroup.id, {
        x: clampedX,
        y: clampedY,
      });
    },
  });

  console.log(anchorPoint);

  return (
    <g
      onMouseDown={startDragging}
      className={`${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
    >
      <rect
        x={coordinates.x1}
        y={coordinates.y2}
        width={width}
        height={height}
        strokeWidth={0.1}
        stroke="red"
        fill="transparent"
      />
      {Array.from({ length: socketGroup.count }).map((_, index) => {
        const moveBy = index * (SOCKET_SIZE + SOCKET_GAP);

        const currX =
          socketGroup.orientation === "horizontal"
            ? coordinates.x1 + moveBy
            : coordinates.x1;

        const currY =
          socketGroup.orientation === "horizontal"
            ? coordinates.y1
            : coordinates.y1 - moveBy;

        return <Socket key={index} x={currX} y={currY - SOCKET_SIZE} />;
      })}

      <line
        x1={plateWidth / 2}
        x2={plateWidth / 2}
        y1={plateHeight}
        y2={0}
        stroke="black"
        strokeWidth={0.5}
      />
      <line
        x1={0}
        x2={plateWidth}
        y1={plateHeight / 2}
        y2={plateHeight / 2}
        stroke="black"
        strokeWidth={0.5}
      />

      <circle cx={coordinates.x1} cy={coordinates.y1} r={1} fill="yellow" />
      <circle cx={anchorPoint.x} cy={anchorPoint.y} r={1} fill="red" />
    </g>
  );
};
