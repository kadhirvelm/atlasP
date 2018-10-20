import { IConnectionEvents } from "../Utils/selectors";

export interface ILink {
  distance: number;
  source: string;
  target: string;
  strength: number;
}

export interface IFilter {
  id: string;
  type: "date" | "user";
  shouldRemove: (value: any) => boolean;
}

export interface IGraphType {
  icon: JSX.Element;
  id: string;
  generateLinks: (id: string, connections: IConnectionEvents) => ILink[];
  tooltip: string | JSX.Element;
}