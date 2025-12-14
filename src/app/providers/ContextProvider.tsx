import {
  MIN_PLATE_WIDTH,
  MIN_PLATE_HEIGHT,
  MIN_PLATE_WIDTH_FOR_SOCKET,
  MIN_PLATE_HEIGHT_FOR_SOCKET,
} from "@/shared/constants";
import type { Plate, SocketGroup } from "@/shared/types";
import { type ReactNode, useState } from "react";
import { ProjectContext } from "./context";

export const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [plates, setPlates] = useState<Plate[]>([
    {
      id: crypto.randomUUID(),
      width: 35,
      height: 64,
      socketGroups: [
        {
          count: 3,
          id: "123",
          orientation: "vertical",
          x: 10,
          y: 10,
        },
      ],
    },
  ]);

  const [socketModeIsOn, setSocketModeIsOn] = useState<boolean>(false);

  const addPlate = () => {
    setPlates((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        width: MIN_PLATE_WIDTH,
        height: MIN_PLATE_HEIGHT,
        socketGroups: [],
      },
    ]);
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
    } else {
      // else place one socketGroup in the middle of the first plate
      // with proper sizes and turn on
      // if no such plate was found just return all plates
      setPlates((prev) => {
        const targetIndex = prev.findIndex(
          (plate: Plate) =>
            plate.width >= MIN_PLATE_WIDTH_FOR_SOCKET &&
            plate.height >= MIN_PLATE_HEIGHT_FOR_SOCKET,
        );

        if (targetIndex === -1) return prev;

        return prev.map((item: Plate, index: number): Plate => {
          if (index === targetIndex) {
            return {
              ...item,
              socketGroups: [
                {
                  id: crypto.randomUUID(),
                  count: 1,
                  orientation: "vertical",
                  x: item.width / 2,
                  y: item.height / 2,
                },
              ],
            };
          } else {
            return item;
          }
        });
      });

      setSocketModeIsOn(true);
    }
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
    addPlate,
    deletePlate,
    resizePlate,
    toggleSocketMode,
    updateSocketGroup,
  };

  return (
    <ProjectContext.Provider value={contextValue}>
      {children}
    </ProjectContext.Provider>
  );
};
