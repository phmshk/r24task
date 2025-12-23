import { useProjectContext } from "@/app/providers";
import { useMemo, useRef, useState } from "react";
import { DimensionsSelection } from "./components/dimensions/DimensionsSelection";
import { SocketsSection } from "./components/sockets/SocketsSection";
import { useIntersectionObserver } from "@/shared/utils";
import { SidebarStep } from "./components/step/SidebarStep";

export const Sidebar = () => {
  const {
    addPlate,
    deletePlate,
    socketModeIsOn,
    plates,
    resizePlate,
    toggleSocketMode,
    updateSocketGroup,
    addSocketGroup,
    removeSocketGroup,
  } = useProjectContext();
  const [selectedPlateId, setSelectedPlateId] = useState<string>(plates[0].id);

  const activePlate =
    plates.find((plate) => plate.id === selectedPlateId) || plates[0];

  const dimensionsRef = useRef<HTMLDivElement>(null);
  const socketsRef = useRef<HTMLDivElement>(null);

  const sections = useMemo(
    () => [
      { id: "section-dimensions", ref: dimensionsRef },
      { id: "section-sockets", ref: socketsRef },
    ],
    [],
  );

  const observerOptions = useMemo(
    () => ({
      //active area of the scrol
      //top 20% of the screen is ignored so that the top element is disabled when it moves to the top
      //bottom 35% of the screen is ignored so that the bottom element is activated only when it moves higher
      rootMargin: "-20% 0px -35% 0px",
      //element is visible if at least 10% is visible
      threshold: 0.4,
    }),
    [],
  );

  const { activeId, setActiveId } = useIntersectionObserver(
    sections,
    observerOptions,
  );

  const handleScroll = (
    id: string,
    ref: React.RefObject<HTMLDivElement | null>,
  ) => {
    setActiveId(id);
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex min-h-1/3 flex-col gap-4">
      <div ref={dimensionsRef} id="section-dimensions">
        <SidebarStep
          isActive={activeId === "section-dimensions"}
          onClick={() => handleScroll("section-dimensions", dimensionsRef)}
          count={1}
        >
          <DimensionsSelection
            addPlate={addPlate}
            deletePlate={deletePlate}
            resizePlate={resizePlate}
            activePlate={activePlate}
            plates={plates}
            setSelectedPlateId={setSelectedPlateId}
          />
        </SidebarStep>
      </div>
      <div ref={socketsRef} id="section-sockets">
        <SidebarStep
          isActive={activeId === "section-sockets"}
          isLast
          onClick={() => handleScroll("section-sockets", socketsRef)}
          count={2}
        >
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
          />
        </SidebarStep>
      </div>
    </div>
  );
};
