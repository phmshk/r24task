import { SOCKET_GAP, SOCKET_SIZE } from "@/shared/constants";
import type { SocketGroup as SocketGroupType } from "@/shared/types";
import { adjustPositionForSVG } from "@/shared/utils";
import { Socket } from "./../Socket/Socket.tsx";
interface ISocketGroup {
  socketGroup: SocketGroupType;
  maxHeight: number;
}

export const SocketGroup = (props: ISocketGroup) => {
  const { socketGroup, maxHeight } = props;

  const anchorPoint = adjustPositionForSVG(
    maxHeight,
    socketGroup.x,
    socketGroup.y,
    SOCKET_SIZE,
    SOCKET_SIZE,
  );

  return (
    <g>
      {Array.from({ length: socketGroup.count }).map((_, index) => {
        const moveBy = index * (SOCKET_SIZE + SOCKET_GAP);

        const currX =
          socketGroup.orientation === "horizontal"
            ? anchorPoint.x + moveBy
            : anchorPoint.x;

        const currY =
          socketGroup.orientation === "horizontal"
            ? anchorPoint.y
            : anchorPoint.y - moveBy;

        return <Socket x={currX} y={currY} />;
      })}
    </g>
  );
};
