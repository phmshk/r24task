import { SOCKET_SIZE, SOCKET_GAP } from "@/shared/constants";
import type { SocketGroup, SocketGroupInfo } from "@/shared/types";

/** Function to get information about a socket group: full coordinates, group width and length
 * @param group - SocketGroup
 * @returns - object with calculated values
 * */
export function calculateValuesForSocketGroup(
  sg: SocketGroup,
): SocketGroupInfo {
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
  return { id: sg.id, width, height, coordinates, anchorPoint };
}

/** Function to check if two socket groups intersect including gap between them
 * @param a - first socket group information with coordinate
 * @param b - second socket group information with coordinates
 * @returns - true if socket groups intersect else false
 * */
export function checkIntersection(
  a: SocketGroupInfo,
  b: SocketGroupInfo,
  margin: number = 0,
): boolean {
  const cA = a.coordinates;
  const cB = b.coordinates;

  // spent too much time mixing coordinates up, which led to bugs
  // normalizing coordinates
  const aX1 = Math.min(cA.x1, cA.x2);
  const aX2 = Math.max(cA.x1, cA.x2);
  const aY1 = Math.min(cA.y1, cA.y2);
  const aY2 = Math.max(cA.y1, cA.y2);

  const bX1 = Math.min(cB.x1, cB.x2);
  const bX2 = Math.max(cB.x1, cB.x2);
  const bY1 = Math.min(cB.y1, cB.y2);
  const bY2 = Math.max(cB.y1, cB.y2);

  return (
    aX1 <= bX2 + margin &&
    aX2 >= bX1 - margin &&
    aY1 <= bY2 + margin &&
    aY2 >= bY1 - margin
  );
}
