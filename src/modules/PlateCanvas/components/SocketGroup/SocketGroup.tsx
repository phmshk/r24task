import {
  SOCKET_GAP,
  SOCKET_MARGIN_FROM_EDGE,
  SOCKET_MARGIN_FROM_GROUP,
  SOCKET_SIZE,
} from "@/shared/constants";
import type { SocketGroup as SocketGroupType } from "@/shared/types";
import {
  calculateValuesForSocketGroup,
  checkIntersection,
} from "@/shared/utils";
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
  const currGroup = calculateValuesForSocketGroup(socketGroup);
  const { isDragging, startDragging } = useDragNDrop({
    initialX: socketGroup.x,
    initialY: socketGroup.y,
    onGroupDrag: (newX: number, newY: number) => {
      const minX = SOCKET_SIZE / 2;
      const minY = currGroup.height - SOCKET_SIZE / 2;
      const maxX = plateWidth - currGroup.width + SOCKET_SIZE / 2;
      const maxY = plateHeight - SOCKET_SIZE / 2;

      // set inner borders
      const clampedX = Math.max(
        minX + SOCKET_MARGIN_FROM_EDGE,
        Math.min(newX, maxX - SOCKET_MARGIN_FROM_EDGE),
      );
      const clampedY = Math.max(
        minY + SOCKET_MARGIN_FROM_EDGE,
        Math.min(newY, maxY - SOCKET_MARGIN_FROM_EDGE),
      );

      // collision checking
      const currentX = socketGroup.x;
      const currentY = socketGroup.y;

      const hasCollision = (targetX: number, targetY: number) => {
        const self = calculateValuesForSocketGroup({
          ...socketGroup,
          x: targetX,
          y: targetY,
        });

        return allGroups
          .filter((item) => item.id !== socketGroup.id)
          .some((item) => {
            const target = calculateValuesForSocketGroup(item);
            return checkIntersection(
              self,
              target,
              SOCKET_MARGIN_FROM_GROUP * 2,
            );
          });
      };

      // trying to move to both new coordinates
      if (!hasCollision(clampedX, clampedY)) {
        updateSocketGroup(plateId, socketGroup.id, {
          x: clampedX,
          y: clampedY,
        });
        return;
      }

      // trying to move on x axis, so leave y as it is now
      if (!hasCollision(clampedX, currentY)) {
        updateSocketGroup(plateId, socketGroup.id, {
          x: clampedX,
          y: currentY,
        });
        return;
      }

      // trying to move on y axis, so leave x as it is now
      if (!hasCollision(currentX, clampedY)) {
        updateSocketGroup(plateId, socketGroup.id, {
          x: currentX,
          y: clampedY,
        });
        return;
      }

      // if here => no possible movement
    },
  });

  return (
    <g
      onMouseDown={startDragging}
      className={`${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
    >
      <rect
        x={currGroup.coordinates.x1}
        y={currGroup.coordinates.y2}
        width={currGroup.width}
        height={currGroup.height}
        strokeWidth={0.1}
        stroke="red"
        fill="transparent"
      />
      {Array.from({ length: socketGroup.count }).map((_, index) => {
        const moveBy = index * (SOCKET_SIZE + SOCKET_GAP);

        const currX =
          socketGroup.orientation === "horizontal"
            ? currGroup.coordinates.x1 + moveBy
            : currGroup.coordinates.x1;

        const currY =
          socketGroup.orientation === "horizontal"
            ? currGroup.coordinates.y1
            : currGroup.coordinates.y1 - moveBy;

        return <Socket key={index} x={currX} y={currY - SOCKET_SIZE} />;
      })}

      {isDragging && (
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
            fontSize={3}
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
            fontSize={3}
            fill="red"
          >
            {(plateHeight - currGroup.anchorPoint.y).toFixed(1)} cm
          </text>
        </g>
      )}

      <circle
        cx={currGroup.coordinates.x1}
        cy={currGroup.coordinates.y1}
        r={1}
        fill="blue"
      />
      <circle
        cx={currGroup.coordinates.x1}
        cy={currGroup.coordinates.y2}
        r={1}
        fill="blue"
      />
      <circle
        cx={currGroup.coordinates.x2}
        cy={currGroup.coordinates.y1}
        r={1}
        fill="blue"
      />
      <circle
        cx={currGroup.coordinates.x2}
        cy={currGroup.coordinates.y2}
        r={1}
        fill="blue"
      />
      <circle
        cx={currGroup.anchorPoint.x}
        cy={currGroup.anchorPoint.y}
        r={1}
        fill="red"
      />
    </g>
  );
};
