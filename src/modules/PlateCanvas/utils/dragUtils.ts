import {
  SOCKET_SIZE,
  SOCKET_MARGIN_FROM_EDGE,
  SOCKET_MARGIN_FROM_GROUP,
} from "@/shared/constants";
import type { SocketGroup } from "@/shared/types";
import { calculateValuesForSocketGroup, checkIntersection } from "./helpers";

interface CalculatePositionParams {
  newX: number;
  newY: number;
  socketGroup: SocketGroup;
  allGroups: SocketGroup[];
  plateWidth: number;
  plateHeight: number;
}

export const calculateNextPosition = ({
  newX,
  newY,
  socketGroup,
  allGroups,
  plateHeight,
  plateWidth,
}: CalculatePositionParams): { x: number; y: number; isBlocked: boolean } => {
  const currGroupValues = calculateValuesForSocketGroup(socketGroup);

  const minX = SOCKET_SIZE / 2;
  const minY = currGroupValues.height - SOCKET_SIZE / 2;
  const maxX = plateWidth - currGroupValues.width + SOCKET_SIZE / 2;
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
        return checkIntersection(self, target, SOCKET_MARGIN_FROM_GROUP * 2);
      });
  };

  const hitWallX = Math.abs(newX - clampedX) > 0.1;
  const hitWallY = Math.abs(newY - clampedY) > 0.1;
  const isWallHit = hitWallX || hitWallY;

  // trying to move to both new coordinates
  if (!hasCollision(clampedX, clampedY)) {
    return { x: clampedX, y: clampedY, isBlocked: isWallHit };
  }

  // trying to move on x axis, so leave y as it is now
  if (!hasCollision(clampedX, currentY)) {
    return { x: clampedX, y: currentY, isBlocked: true };
  }

  // trying to move on y axis, so leave x as it is now
  if (!hasCollision(currentX, clampedY)) {
    return { x: currentX, y: clampedY, isBlocked: true };
  }

  // if here => no possible movement
  return { x: currentX, y: currentY, isBlocked: true };
};
