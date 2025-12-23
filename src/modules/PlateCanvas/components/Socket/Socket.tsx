import { SOCKET_SIZE } from "@/shared/constants";

interface SocketProps {
  x: number;
  y: number;
}

export const Socket = (props: SocketProps) => {
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
