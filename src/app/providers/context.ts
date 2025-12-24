// NOTE: React Context used intentionally
// to show that I can work not only with libraries and immer,
// but also with native tools and understand immutability principles

import type {
  ActiveStep,
  Coordinates,
  Plate,
  SocketGroup,
} from "@/shared/types";
import { createContext, useContext } from "react";

interface IProjectContext {
  plates: Plate[];
  activeStep: ActiveStep;
  selectedPlateId: string;
  selectedSocketGroupId: string | null;
  setSelectedSocketGroupId: (id: string | null) => void;
  setSelectedPlateId: (id: string) => void;
  setActiveStep: (step: ActiveStep) => void;
  addPlate: () => string;
  deletePlate: (id: string) => void;
  resizePlate: (id: string, newWidth: number, newHeight: number) => void;
  socketModeIsOn: boolean;
  toggleSocketMode: () => { groupId: string; plateId: string } | null;
  updateSocketGroup: (
    plateId: string,
    groupId: string,
    data: Partial<SocketGroup>,
  ) => void;
  addSocketGroup: (plateId: string, socketPosition?: Coordinates) => string;
  removeSocketGroup: (plateId: string, groupId: string) => void;
}

export const ProjectContext = createContext<IProjectContext | null>(null);

export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within ProjectContextProvider");
  }
  return context;
};
