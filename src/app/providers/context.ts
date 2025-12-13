// NOTE: React Context used intentionally
// to show that I can work not only with libraries and immer,
// but also with native tools and understand immutability principles

import type { Plate, SocketGroup } from "@/shared/types";
import { createContext, useContext } from "react";

interface IProjectContext {
  plates: Plate[];
  addPlate: () => void;
  deletePlate: (id: string) => void;
  resizePlate: (id: string, newWidth: number, newHeight: number) => void;
  socketModeIsOn: boolean;
  toggleSocketMode: () => void;
  updateSocketGroup: (
    plateId: string,
    groupId: string,
    data: Partial<SocketGroup>,
  ) => void;
}

export const ProjectContext = createContext<IProjectContext | null>(null);

export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within ProjectContextProvider");
  }
  return context;
};
