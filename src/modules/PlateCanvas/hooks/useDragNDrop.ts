import { useEffect, useState } from "react";

interface IUseDragNDrop {
  initialX: number;
  initialY: number;
  onGroupDrag: (x: number, y: number) => void;
}

export const useDragNDrop = ({
  initialX,
  initialY,
  onGroupDrag,
}: IUseDragNDrop) => {
  const [dragStart, setDragStart] = useState<{
    mouseX: number;
    mouseY: number;
    originalX: number;
    originalY: number;
    scaleX: number;
    scaleY: number;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const startDragging = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const parentPlate = (e.target as Element).closest("svg");

    if (!parentPlate) {
      console.error("No parent plate found");
      return;
    }

    // get size of plate in px
    const domRect = parentPlate.getBoundingClientRect();

    // get size of plate in cm
    const viewBoxWidth = parentPlate.viewBox.baseVal.width;
    const viewBoxHeight = parentPlate.viewBox.baseVal.height;

    // find scaling between px and cm
    const scaling = {
      x: viewBoxWidth / domRect.width,
      y: viewBoxHeight / domRect.height,
    };

    setDragStart({
      mouseX: e.clientX,
      mouseY: e.clientY,
      originalX: initialX,
      originalY: initialY,
      scaleX: scaling.x,
      scaleY: scaling.y,
    });
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging || !dragStart) return;

    const handleMouseMove = (e: MouseEvent) => {
      // mouse position change in px
      const dPxX = e.clientX - dragStart.mouseX;
      const dPxY = e.clientY - dragStart.mouseY;

      // px to cm
      const dCmX = dPxX * dragStart.scaleX;
      const dCmY = dPxY * dragStart.scaleY;

      // new position in cm
      const newCmX = dragStart.originalX + dCmX;
      const newCmY = dragStart.originalY + dCmY;

      onGroupDrag(newCmX, newCmY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setDragStart(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragStart, onGroupDrag]);

  return { isDragging, startDragging };
};
