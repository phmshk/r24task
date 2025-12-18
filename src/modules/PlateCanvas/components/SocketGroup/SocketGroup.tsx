import { SOCKET_GAP, SOCKET_SIZE } from "@/shared/constants";
import type { SocketGroup as SocketGroupType } from "@/shared/types";
import { Socket } from "./../Socket/Socket.tsx";
import { useDragNDrop } from "../../hooks/useDragNDrop.ts";
import { useProjectContext } from "@/app/providers/context.ts";
import { createPortal } from "react-dom";
import { AnchorPointGuidelnes } from "./AnchorPointGuidelines.tsx";
import { useEffect, useState } from "react";
import { calculateNextPosition } from "../../utils/dragUtils.ts";
import { calculateValuesForSocketGroup } from "../../utils/helpers.ts";

interface ISocketGroup {
  socketGroup: SocketGroupType;
  plateId: string;
  plateHeight: number;
  plateWidth: number;
  allGroups: SocketGroupType[];
  overlayNode: SVGElement | null;
  onDragStateChange: (isDragging: boolean) => void;
}

export const SocketGroup = (props: ISocketGroup) => {
  const {
    socketGroup,
    plateId,
    plateHeight,
    plateWidth,
    allGroups,
    overlayNode,
    onDragStateChange,
  } = props;
  const { updateSocketGroup } = useProjectContext();
  const currGroup = calculateValuesForSocketGroup(socketGroup);
  const [isMovementBlocked, setIsMovementBlocked] = useState(false);

  // Drang and Drop
  const { isDragging, startDragging } = useDragNDrop({
    initialX: socketGroup.x,
    initialY: socketGroup.y,
    onGroupDrag: (newX: number, newY: number) => {
      const result = calculateNextPosition({
        newX,
        newY,
        socketGroup,
        allGroups,
        plateWidth,
        plateHeight,
      });

      // observe movement block
      if (result.isBlocked !== isMovementBlocked) {
        setIsMovementBlocked(result.isBlocked);
      }

      // no coordinates change => nothing to update
      if (result.x === socketGroup.x && result.y === socketGroup.y) return;

      updateSocketGroup(plateId, socketGroup.id, { x: result.x, y: result.y });
    },
  });

  // showing margins on dragging
  useEffect(() => {
    onDragStateChange(isDragging);
  }, [isDragging, onDragStateChange]);

  // cursor appearance depending on cursor position
  useEffect(() => {
    if (isDragging) {
      document.body.style.cursor = isMovementBlocked
        ? "not-allowed"
        : "grabbing";
    } else {
      document.body.style.cursor = "auto";
    }

    return () => {
      document.body.style.cursor = "auto";
    };
  }, [isDragging, isMovementBlocked]);

  return (
    <g
      onPointerDown={startDragging}
      className={`${isDragging ? (isMovementBlocked ? "cursor-not-allowed" : "cursor-grabbing") : "cursor-grab"} touch-none select-none`}
    >
      <rect
        x={currGroup.coordinates.x1}
        y={currGroup.coordinates.y2}
        width={currGroup.width}
        height={currGroup.height}
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

      {isDragging && overlayNode
        ? createPortal(
            <AnchorPointGuidelnes
              currGroup={currGroup}
              plateHeight={plateHeight}
            />,
            overlayNode,
          )
        : null}
    </g>
  );
};
