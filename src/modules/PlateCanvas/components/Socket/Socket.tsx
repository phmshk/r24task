import { SOCKET_SIZE } from "@/shared/constants";
import socketicon from "@/shared/assets/icons/steckdose_1.webp";

interface SocketProps {
  x: number;
  y: number;
}

export const Socket = (props: SocketProps) => {
  const { x, y } = props;

  return (
    <image
      href={socketicon}
      x={x}
      y={y}
      width={SOCKET_SIZE}
      height={SOCKET_SIZE}
      className="touch-none"
    />
  );
};
