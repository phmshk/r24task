import {
  MIN_PLATE_WIDTH,
  MIN_PLATE_HEIGHT,
  MIN_PLATE_WIDTH_FOR_SOCKET,
  MIN_PLATE_HEIGHT_FOR_SOCKET,
} from "@/shared/constants";
import {
  type ActiveStep,
  type Coordinates,
  type Plate,
  type SocketGroup,
} from "@/shared/types";
import { type ReactNode, useState } from "react";
import { ProjectContext } from "./context";

export const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [plates, setPlates] = useState<Plate[]>([
    {
      id: crypto.randomUUID(),
      width: 80,
      height: 40,
      socketGroups: [],
    },
  ]);

  const [socketModeIsOn, setSocketModeIsOn] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<ActiveStep>("dimensions");
  const [selectedPlateId, setSelectedPlateId] = useState<string>(plates[0].id);

  const addPlate = (): string => {
    const newPlate = {
      id: crypto.randomUUID(),
      width: MIN_PLATE_WIDTH,
      height: MIN_PLATE_HEIGHT,
      socketGroups: [],
    };
    setPlates((prev) => [...prev, newPlate]);
    return newPlate.id;
  };

  const deletePlate = (id: string) => {
    if (plates.length < 2) {
      return;
    }

    setPlates((prev) => prev.filter((item) => item.id !== id));
  };

  const resizePlate = (id: string, newWidth: number, newHeight: number) => {
    const updatedPlates = plates.map((item: Plate): Plate => {
      if (item.id === id) {
        return {
          id: item.id,
          width: newWidth,
          height: newHeight,
          socketGroups: [],
        };
      }
      return item;
    });

    setPlates(updatedPlates);
  };

  const toggleSocketMode = () => {
    // check state of socketMode
    if (socketModeIsOn) {
      // if on => clear all socketGroups and turn off
      setPlates((prev) =>
        prev.map((item: Plate): Plate => ({ ...item, socketGroups: [] })),
      );
      setSocketModeIsOn(false);
      return null;
    } else {
      // else place one socketGroup in the middle of the first plate
      // with proper sizes and turn on
      // if no such plate was found just return all plates
      const newSocketGroupId = crypto.randomUUID();
      let plateIdWithNewSocket = "";

      setPlates((prev) => {
        const targetIndex = prev.findIndex(
          (plate: Plate) =>
            plate.width >= MIN_PLATE_WIDTH_FOR_SOCKET &&
            plate.height >= MIN_PLATE_HEIGHT_FOR_SOCKET,
        );

        if (targetIndex === -1) return prev;

        return prev.map((item: Plate, index: number): Plate => {
          if (index === targetIndex) {
            plateIdWithNewSocket = item.id;
            return {
              ...item,
              socketGroups: [
                {
                  id: newSocketGroupId,
                  count: 1,
                  orientation: "vertical",
                  x: Number((item.width / 2).toFixed(1)),
                  y: Number((item.height / 2).toFixed(1)),
                },
              ],
            };
          } else {
            return item;
          }
        });
      });

      setSocketModeIsOn(true);

      if (plateIdWithNewSocket) {
        return { groupId: newSocketGroupId, plateId: plateIdWithNewSocket };
      }
      return null;
    }
  };

  const addSocketGroup = (plateId: string, socketPosition?: Coordinates) => {
    const socketId = crypto.randomUUID();
    setPlates((prev) =>
      prev.map((plate) => {
        if (plate.id === plateId) {
          const newGroup: SocketGroup = {
            id: socketId,
            count: 1,
            orientation: "vertical",
            x: socketPosition
              ? socketPosition.x
              : Number((plate.width / 2).toFixed(1)),
            y: socketPosition
              ? socketPosition.y
              : Number((plate.height / 2).toFixed(1)),
          };
          return { ...plate, socketGroups: [...plate.socketGroups, newGroup] };
        }
        return plate;
      }),
    );

    return socketId;
  };

  const removeSocketGroup = (plateId: string, groupId: string) => {
    setPlates((prev) =>
      prev.map((plate) => {
        if (plate.id === plateId) {
          return {
            ...plate,
            socketGroups: plate.socketGroups.filter((g) => g.id !== groupId),
          };
        }
        return plate;
      }),
    );
  };

  const updateSocketGroup = (
    plateId: string,
    groupId: string,
    data: Partial<SocketGroup>,
  ) => {
    // create updated plates array
    const updatedPlates = plates.map((plate: Plate): Plate => {
      // find needed plate
      if (plate.id === plateId) {
        // create updated sockets array
        const updatedGroups = plate.socketGroups.map(
          (group: SocketGroup): SocketGroup => {
            if (group.id === groupId) {
              //mutate data
              return { ...group, ...data };
            } else {
              return group;
            }
          },
        );
        return { ...plate, socketGroups: updatedGroups };
      } else {
        return plate;
      }
    });

    setPlates(updatedPlates);
  };

  const contextValue = {
    plates,
    socketModeIsOn,
    activeStep,
    selectedPlateId,
    setSelectedPlateId,
    setActiveStep,
    addPlate,
    deletePlate,
    resizePlate,
    toggleSocketMode,
    updateSocketGroup,
    addSocketGroup,
    removeSocketGroup,
  };

  return (
    <ProjectContext.Provider value={contextValue}>
      {children}
    </ProjectContext.Provider>
  );
};
