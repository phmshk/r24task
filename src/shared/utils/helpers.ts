import type { Coordinates } from "@/shared/types";

/** Function to adjust cartesian (x;y) coordinates (0;0 at bottom-left corner)
 * to HTML SVG coordinates (0;0 at top-left corner).
 * @param containerHeight - height of parent container
 * @param distanceX - distance from left to center
 * @param distanceY - distance from bottom to center
 * @param width - width of obj being positioned
 * @param height - height of obj being positioned
 * @return - coordinates of object adjusted for SVG
 */
export function adjustPositionForSVG(
  containerHeight: number,
  distanceX: number,
  distanceY: number,
  width: number,
  height: number,
): Coordinates {
  return {
    x: distanceX - width / 2,
    y: containerHeight - distanceY - height / 2,
  };
}
