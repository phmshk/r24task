import { useProjectContext } from "@/app/providers";
import type { ActiveStep } from "@/shared/types";
import { useRef } from "react";
import { DimensionsSelection } from "@/modules/Sidebar/components/dimensions/DimensionsSelection";
import { SocketsSection } from "@/modules/Sidebar/components/sockets/SocketsSection";

export interface StepConfig {
  id: string;
  value: ActiveStep;
  ref: React.RefObject<HTMLDivElement | null>;
  component: React.ReactNode;
}

export const useSidebarSteps = () => {
  const {
    addPlate,
    deletePlate,
    resizePlate,
    plates,
    selectedPlateId,
    setSelectedPlateId,
    socketModeIsOn,
    toggleSocketMode,
    updateSocketGroup,
    addSocketGroup,
    removeSocketGroup,
    selectedSocketGroupId,
    setSelectedSocketGroupId,
  } = useProjectContext();

  const activePlate = plates.find((p) => p.id === selectedPlateId) || plates[0];

  const dimensionsRef = useRef<HTMLDivElement>(null);
  const socketsRef = useRef<HTMLDivElement>(null);

  const steps: StepConfig[] = [
    {
      id: "section-dimensions",
      value: "dimensions",
      ref: dimensionsRef,
      component: (
        <DimensionsSelection
          addPlate={addPlate}
          deletePlate={deletePlate}
          resizePlate={resizePlate}
          activePlate={activePlate}
          plates={plates}
          setSelectedPlateId={setSelectedPlateId}
        />
      ),
    },
    {
      id: "section-sockets",
      value: "sockets",
      ref: socketsRef,
      component: (
        <SocketsSection
          plates={plates}
          socketModeIsOn={socketModeIsOn}
          toggleSocketMode={toggleSocketMode}
          updateSocketGroup={updateSocketGroup}
          selectedPlateId={selectedPlateId}
          setSelectedPlateId={setSelectedPlateId}
          activePlate={activePlate}
          addSocketGroup={addSocketGroup}
          removeSocketGroup={removeSocketGroup}
          selectedSocketGroupId={selectedSocketGroupId}
          setSelectedSocketGroupId={setSelectedSocketGroupId}
        />
      ),
    },
  ];

  return steps;
};
