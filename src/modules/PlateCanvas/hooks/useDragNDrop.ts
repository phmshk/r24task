import { useCallback, useEffect, useRef, useState } from "react";

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
    pointerId: number;
    target: Element;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // ref for onGroupDrag so that event listeners wont be reapplied on every socket group update
  const onGroupDragRef = useRef(onGroupDrag);

  useEffect(() => {
    onGroupDragRef.current = onGroupDrag;
  }, [onGroupDrag]);

  const startDragging = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // helps not to loose the element on quick dragging (found in the web)
      (e.target as Element).setPointerCapture(e.pointerId);

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
        pointerId: e.pointerId,
        target: e.target as Element,
      });
      setIsDragging(true);
    },
    [initialX, initialY],
  );

  useEffect(() => {
    if (!isDragging || !dragStart) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerId !== dragStart.pointerId) return;

      e.preventDefault();

      // mouse position change in px
      const dPxX = e.clientX - dragStart.mouseX;
      const dPxY = e.clientY - dragStart.mouseY;

      // px to cm
      const dCmX = dPxX * dragStart.scaleX;
      const dCmY = dPxY * dragStart.scaleY;

      // new position in cm
      const newCmX = dragStart.originalX + dCmX;
      const newCmY = dragStart.originalY + dCmY;

      onGroupDragRef.current(newCmX, newCmY);
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (e.pointerId !== dragStart.pointerId) return;
      dragStart.target.releasePointerCapture(dragStart.pointerId);
      setIsDragging(false);
      setDragStart(null);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.addEventListener("pointercancel", handlePointerUp);
    };
  }, [isDragging, dragStart]);

  return { isDragging, startDragging };
};
