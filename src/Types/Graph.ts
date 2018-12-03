import { IEvent } from "./Events";
import { IPersonFrequency, IUser } from "./Users";

export interface ILink {
  color?: string;
  distance: number;
  opacity?: number;
  source: string;
  strength: number;
  strokeWidth?: number;
  target: string;
}

export interface IFilter {
  id: string;
  type: "date" | "user";
  shouldKeep: (
    value: any,
    frequency?: IPersonFrequency,
    currentUser?: IUser
  ) => boolean;
}

export interface IGraphType {
  icon: JSX.Element;
  id: string;
  generateLinks: (id: string, connections: Map<string, IEvent[]>) => ILink[];
  tooltip: string | JSX.Element;
}
