import { SOCKET_SIZE } from "@/shared/constants";

interface ISocket {
  x: number;
  y: number;
}

export const Socket = (props: ISocket) => {
  const { x, y } = props;

  return (
    <rect
      x={x}
      y={y}
      width={SOCKET_SIZE}
      height={SOCKET_SIZE}
      className="fill-green-400"
    />
  );
};
