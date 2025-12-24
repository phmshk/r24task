import {
  SOCKET_GAP,
  SOCKET_MARGIN_FROM_GROUP,
  SOCKET_SIZE,
} from "@/shared/constants";
import type { SocketGroup as SocketGroupType } from "@/shared/types";
import { Socket } from "./../Socket/Socket.tsx";
import { useDragNDrop } from "../../hooks/useDragNDrop.ts";
import { useProjectContext } from "@/app/providers/context.ts";
import { createPortal } from "react-dom";
import { AnchorPointGuidelnes } from "./AnchorPointGuidelines.tsx";
import { useEffect, useState, useMemo, useRef } from "react";
import { calculateNextPosition } from "@/shared/utils/dragUtils.ts";
import {
  calculateValuesForSocketGroup,
  checkIntersection,
} from "@/shared/utils/helpers.ts";
import { cn } from "@/shared/utils/index.ts";

interface SocketGroupProps {
  socketGroup: SocketGroupType;
  plateId: string;
  plateHeight: number;
  plateWidth: number;
  allGroups: SocketGroupType[];
  overlayNode: SVGElement | null;
  selectedSocketGroupId: string | null;
  onDragStateChange: (isDragging: boolean) => void;
}

export const SocketGroup = (props: SocketGroupProps) => {
  const {
    socketGroup,
    plateId,
    plateHeight,
    plateWidth,
    allGroups,
    overlayNode,
    selectedSocketGroupId,
    onDragStateChange,
  } = props;

  const { updateSocketGroup } = useProjectContext();

  // local state for position while dragging
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMovementBlocked, setIsMovementBlocked] = useState(false);
  const [collidedGroups, setCollidedGroups] = useState<SocketGroupType[]>([]);

  const lastValidPos = useRef({ x: socketGroup.x, y: socketGroup.y });

  useEffect(() => {
    lastValidPos.current = { x: socketGroup.x, y: socketGroup.y };
  }, [socketGroup.x, socketGroup.y]);

  const currentSocketGroup = useMemo(
    () => ({
      ...socketGroup,
      x: socketGroup.x + dragOffset.x,
      y: socketGroup.y + dragOffset.y,
    }),
    [socketGroup, dragOffset],
  );

  const currGroupCalculated = calculateValuesForSocketGroup(currentSocketGroup);

  // Drag and Drop
  const { isDragging, startDragging } = useDragNDrop({
    initialX: socketGroup.x,
    initialY: socketGroup.y,
    onDrag: (newX: number, newY: number) => {
      const dynamicSocketGroup = {
        ...socketGroup,
        x: lastValidPos.current.x,
        y: lastValidPos.current.y,
      };
      const result = calculateNextPosition({
        newX,
        newY,
        socketGroup: dynamicSocketGroup,
        allGroups,
        plateWidth,
        plateHeight,
      });

      setIsMovementBlocked(result.isBlocked);

      if (result.isBlocked) {
        const selfRect = calculateValuesForSocketGroup({
          ...socketGroup,
          x: result.x,
          y: result.y,
        });

        const hitGroup = allGroups.find((group) => {
          if (group.id === socketGroup.id) return false;

          const targetRect = calculateValuesForSocketGroup(group);

          return !checkIntersection(
            selfRect,
            targetRect,
            SOCKET_MARGIN_FROM_GROUP * 2,
          );
        });

        if (hitGroup) {
          setCollidedGroups((prev) => [...prev, hitGroup]);
        } else {
          setCollidedGroups([]);
        }
      } else {
        setCollidedGroups([]);
      }

      // get last valid position
      if (!result.isBlocked) {
        lastValidPos.current = {
          x: result.x,
          y: result.y,
        };
      }

      // no coordinates change => nothing to update
      if (result.x === socketGroup.x && result.y === socketGroup.y) return;

      setDragOffset({
        x: result.x - socketGroup.x,
        y: result.y - socketGroup.y,
      });
    },
    onDragEnd: (newX, newY) => {
      const dynamicSocketGroup = {
        ...socketGroup,
        x: lastValidPos.current.x,
        y: lastValidPos.current.y,
      };
      const result = calculateNextPosition({
        newX,
        newY,
        socketGroup: dynamicSocketGroup,
        allGroups,
        plateWidth,
        plateHeight,
      });

      setIsMovementBlocked(false);
      setDragOffset({ x: 0, y: 0 });
      setCollidedGroups([]);

      if (result.x !== socketGroup.x || result.y !== socketGroup.y) {
        updateSocketGroup(plateId, socketGroup.id, {
          x: result.x,
          y: result.y,
        });
      }
    },
  });

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

  const obstacleGroups = useMemo(() => {
    if (!collidedGroups) return null;
    return collidedGroups.map((group) => calculateValuesForSocketGroup(group));
  }, [collidedGroups]);

  return (
    <g
      onPointerDown={startDragging}
      className={cn(
        "touch-none select-none",
        isDragging
          ? isMovementBlocked
            ? "cursor-not-allowed"
            : "cursor-grabbing"
          : "cursor-grab",
        selectedSocketGroupId
          ? socketGroup.id === selectedSocketGroupId
            ? "opacity-100"
            : "opacity-35"
          : "opacity-100",
      )}
    >
      {Array.from({ length: socketGroup.count }).map((_, index) => {
        const moveBy = index * (SOCKET_SIZE + SOCKET_GAP);

        const currX =
          socketGroup.orientation === "horizontal"
            ? currGroupCalculated.coordinates.x1 + moveBy
            : currGroupCalculated.coordinates.x1;

        const currY =
          socketGroup.orientation === "horizontal"
            ? currGroupCalculated.coordinates.y1
            : currGroupCalculated.coordinates.y1 - moveBy;

        return <Socket key={index} x={currX} y={currY - SOCKET_SIZE} />;
      })}

      {isDragging && overlayNode ? (
        <>
          {createPortal(
            <AnchorPointGuidelnes
              currGroup={currGroupCalculated}
              plateHeight={plateHeight}
            />,
            overlayNode,
          )}
          {collidedGroups &&
            obstacleGroups &&
            obstacleGroups.map((rect) =>
              createPortal(
                <g pointerEvents="none" className="touch-none">
                  <rect
                    x={rect.coordinates.x1 - SOCKET_MARGIN_FROM_GROUP * 2}
                    y={rect.coordinates.y2 - SOCKET_MARGIN_FROM_GROUP * 2}
                    width={rect.width + SOCKET_MARGIN_FROM_GROUP * 4}
                    height={rect.height + SOCKET_MARGIN_FROM_GROUP * 4}
                    fill="transparent"
                    stroke="red"
                    strokeWidth="0.1"
                    strokeDasharray="1 1"
                    className="touch-none"
                  />
                </g>,
                overlayNode,
              ),
            )}
        </>
      ) : null}

      <rect
        x={currGroupCalculated.coordinates.x1}
        y={currGroupCalculated.coordinates.y2}
        width={currGroupCalculated.width}
        height={currGroupCalculated.height}
        fill="transparent"
        className="touch-none"
      />
    </g>
  );
};
