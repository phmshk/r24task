import type { Plate as PlateType } from "@/shared/types";
import { SocketGroup } from "../SocketGroup/SocketGroup";
import { useState } from "react";
import { PlateMargins } from "../PlateMargins/PlateMargins";

interface PlateProps {
  plate: PlateType;
  xPosition: number;
  maxHeight: number;
  selectedSocketGroupId: string | null;
}

export const Plate = (props: PlateProps) => {
  const { plate, xPosition, maxHeight, selectedSocketGroupId } = props;

  const [overlayNode, setOverlayNode] = useState<SVGElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <svg
      width={plate.width}
      height={plate.height}
      x={xPosition}
      y={maxHeight - plate.height}
      viewBox={`0 0 ${plate.width} ${plate.height}`}
      className="overflow-visible"
    >
      <rect width="100%" height="100%" className="touch-none fill-white" />
      {plate.socketGroups.map((item) => (
        <SocketGroup
          key={item.id}
          socketGroup={item}
          plateId={plate.id}
          plateWidth={plate.width}
          plateHeight={plate.height}
          allGroups={plate.socketGroups}
          overlayNode={overlayNode}
          onDragStateChange={setIsDragging}
          selectedSocketGroupId={selectedSocketGroupId}
        />
      ))}
      {/* Overlay for guidelines */}
      <g ref={setOverlayNode} className="pointer-events-none touch-none" />
      {/* Plate margins */}
      {isDragging && <PlateMargins width={plate.width} height={plate.height} />}
    </svg>
  );
};
