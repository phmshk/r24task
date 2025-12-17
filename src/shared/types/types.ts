export interface SocketGroup {
  id: string;
  count: 1 | 2 | 3 | 4 | 5;
  x: number;
  y: number;
  orientation: "vertical" | "horizontal";
}

export interface SocketGroupInfo {
  id: string;
  width: number;
  height: number;
  coordinates: { x1: number; x2: number; y1: number; y2: number };
  anchorPoint: { x: number; y: number };
}

export interface Plate {
  id: string;
  width: number; //cm
  height: number; //cm
  socketGroups: SocketGroup[]; //Array of sockets
}

export interface Coordinates {
  x: number;
  y: number;
}
