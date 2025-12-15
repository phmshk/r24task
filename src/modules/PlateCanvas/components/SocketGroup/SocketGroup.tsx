import { SOCKET_GAP, SOCKET_SIZE } from "@/shared/constants";
import type { SocketGroup as SocketGroupType } from "@/shared/types";
import { adjustPositionForSVG } from "@/shared/utils";
import { Socket } from "./../Socket/Socket.tsx";
import { useDragNDrop } from "../../hooks/useDragNDrop.ts";
import { useProjectContext } from "@/app/providers/context.ts";

interface ISocketGroup {
  socketGroup: SocketGroupType;
  plateId: string;
  plateHeight: number;
  plateWidth: number;
}

export const SocketGroup = (props: ISocketGroup) => {
  const { socketGroup, plateId, plateHeight, plateWidth } = props;
  const { updateSocketGroup } = useProjectContext();

  const totalGaps = (socketGroup.count - 1) * SOCKET_GAP;
  const totalSockets = socketGroup.count * SOCKET_SIZE;
  const totalLength = totalSockets + totalGaps;

  const groupWidth =
    socketGroup.orientation === "horizontal" ? totalLength : SOCKET_SIZE;

  const groupHeight =
    socketGroup.orientation === "vertical" ? totalLength : SOCKET_SIZE;

  const anchorPoint = adjustPositionForSVG(
    plateHeight,
    socketGroup.x,
    socketGroup.y,
  );

  const bottomLeftAnchorSocketCorner = {
    x: anchorPoint.x - SOCKET_SIZE / 2,
    y: anchorPoint.y + SOCKET_SIZE / 2,
  };

  const { isDragging, startDragging } = useDragNDrop({
    initialX: socketGroup.x,
    initialY: socketGroup.y,
    onGroupDrag: (newX: number, newY: number) => {
      //clamping handling
      const halfSocket = SOCKET_SIZE / 2;
      const minX = halfSocket;
      const minY = halfSocket;
      const maxX = plateWidth - groupWidth + halfSocket;
      const maxY = plateHeight - groupHeight + halfSocket;
      const clampedX = Math.max(minX, Math.min(newX, maxX));
      const clampedY = Math.max(minY, Math.min(newY, maxY));
      updateSocketGroup(plateId, socketGroup.id, { x: clampedX, y: clampedY });
    },
  });

  return (
    <g
      onMouseDown={startDragging}
      className={`${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
    >
      <rect
        x={bottomLeftAnchorSocketCorner.x}
        y={
          socketGroup.orientation === "vertical"
            ? bottomLeftAnchorSocketCorner.y - groupHeight
            : bottomLeftAnchorSocketCorner.y
        }
        width={groupWidth}
        height={groupHeight}
        fill="transparent"
      />
      {Array.from({ length: socketGroup.count }).map((_, index) => {
        const moveBy = index * (SOCKET_SIZE + SOCKET_GAP);

        const currX =
          socketGroup.orientation === "horizontal"
            ? bottomLeftAnchorSocketCorner.x + moveBy
            : bottomLeftAnchorSocketCorner.x;

        const currY =
          socketGroup.orientation === "horizontal"
            ? bottomLeftAnchorSocketCorner.y
            : bottomLeftAnchorSocketCorner.y - moveBy;

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

      <circle
        cx={bottomLeftAnchorSocketCorner.x}
        cy={bottomLeftAnchorSocketCorner.y}
        r={1}
        fill="yellow"
      />
      <circle cx={anchorPoint.x} cy={anchorPoint.y} r={1} fill="red" />
    </g>
  );
};
