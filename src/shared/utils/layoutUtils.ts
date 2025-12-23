import {
  MIN_PLATE_HEIGHT_FOR_SOCKET,
  MIN_PLATE_WIDTH_FOR_SOCKET,
  SOCKET_MARGIN_FROM_EDGE,
  SOCKET_MARGIN_FROM_GROUP,
} from "@/shared/constants";
import type { SocketGroup, Plate } from "@/shared/types";
import { calculateValuesForSocketGroup, checkIntersection } from "./helpers";

/**
 * Function to check if socket group  can be placed on plate
 * @param group - socket group to be placed
 * @param plate - plate to place on
 * @param excludeGroupId group to ignore
 */
export const canPlaceGroup = (
  group: SocketGroup,
  plate: Plate,
  excludeGroupId?: string,
): boolean => {
  const groupInfo = calculateValuesForSocketGroup(group);
  const { coordinates: c } = groupInfo;

  // normalize coordinates
  const x1 = Math.min(c.x1, c.x2);
  const x2 = Math.max(c.x1, c.x2);
  const y1 = Math.min(c.y1, c.y2);
  const y2 = Math.max(c.y1, c.y2);

  if (
    x1 < SOCKET_MARGIN_FROM_EDGE ||
    y1 < SOCKET_MARGIN_FROM_EDGE ||
    x2 > plate.width - SOCKET_MARGIN_FROM_EDGE ||
    y2 > plate.height - SOCKET_MARGIN_FROM_EDGE
  ) {
    return false;
  }

  const marginForIntersection = SOCKET_MARGIN_FROM_GROUP * 2;

  return !plate.socketGroups.some((existingGroup) => {
    if (existingGroup.id === excludeGroupId) return false;

    const existingGroupInfo = calculateValuesForSocketGroup(existingGroup);

    return checkIntersection(
      groupInfo,
      existingGroupInfo,
      marginForIntersection,
    );
  });
};

/**
 * Function to find first free space for socket group
 * @param plate - plate to search on
 * @param size - size of group to add 1 - 5
 * @param orientation - orientation of group to add "horizontal" or "vertical"
 */
export const findNextAvailablePosition = (
  plate: Plate,
  size: 1 | 2 | 3 | 4 | 5,
  orientation: "horizontal" | "vertical",
): { x: number; y: number } | null => {
  if (
    plate.width < MIN_PLATE_WIDTH_FOR_SOCKET ||
    plate.height < MIN_PLATE_HEIGHT_FOR_SOCKET
  )
    return null;

  const step = 0.5;
  const tempGroup: SocketGroup = {
    id: "temp",
    x: 0,
    y: 0,
    count: size,
    orientation: orientation,
  } as SocketGroup;

  for (let y = SOCKET_MARGIN_FROM_EDGE; y <= plate.height; y += step) {
    for (let x = SOCKET_MARGIN_FROM_EDGE; x <= plate.width; x += step) {
      tempGroup.x = x;
      tempGroup.y = y;

      if (canPlaceGroup(tempGroup, plate)) {
        return { x, y };
      }
    }
  }

  return null;
};
