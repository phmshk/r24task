export interface SocketGroup {
  id: string;
  count: 1 | 2 | 3 | 4 | 5;
  x: number;
  y: number;
  orientation: "vertical" | "horizontal";
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
