import type { SocketGroup } from "@/shared/types";
import { SOCKET_GAP, SOCKET_SIZE } from "../constants";

/** Function to get information about a socket group: full coordinates, group width and length
 * @param group - SocketGroup
 * @returns - object with calculated values
 * */
export function calculateValuesForSocketGroup(sg: SocketGroup): {
  width: number;
  height: number;
  coordinates: { x1: number; x2: number; y1: number; y2: number };
  anchorPoint: { x: number; y: number };
} {
  const halfSize = SOCKET_SIZE / 2;
  const totalLength = sg.count * SOCKET_SIZE + (sg.count - 1) * SOCKET_GAP;

  const width = sg.orientation === "vertical" ? SOCKET_SIZE : totalLength;
  const height = sg.orientation === "vertical" ? totalLength : SOCKET_SIZE;
  const coordinates = {
    x1: sg.x - halfSize,
    x2: sg.x - halfSize + width,
    y1: sg.y + halfSize,
    y2: sg.y + halfSize - height,
  };

  const anchorPoint = { x: sg.x, y: sg.y };
  return { width, height, coordinates, anchorPoint };
}

/** Function to check if two socket groups intersect
 * @param a - first socket group
 * @param b - second socket group
 * @returns - true if socket groups intersect else false
 * */
export function checkIntersection(a: SocketGroup, b: SocketGroup): boolean {
  const cA = {
    x1: a.x,
    x2:
      a.orientation === "vertical"
        ? a.x + SOCKET_SIZE
        : a.x + a.count * (SOCKET_SIZE + SOCKET_GAP) - SOCKET_GAP,
    y1: a.y,
    y2:
      a.orientation === "vertical"
        ? a.y - a.count * (SOCKET_SIZE + SOCKET_GAP) - SOCKET_GAP
        : a.y + SOCKET_SIZE,
  };

  const cB = {
    x1: b.x,
    x2:
      b.orientation === "vertical"
        ? b.x + SOCKET_SIZE
        : b.x + b.count * (SOCKET_SIZE + SOCKET_GAP) - SOCKET_GAP,
    y1: b.y,
    y2:
      b.orientation === "vertical"
        ? b.y - b.count * (SOCKET_SIZE + SOCKET_GAP) - SOCKET_GAP
        : b.y + SOCKET_SIZE,
  };
  return !(cA.y1 < cB.y2 || cA.y2 > cB.y1 || cA.x2 < cB.x1 || cA.x1 > cB.x2);
}
