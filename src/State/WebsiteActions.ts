import { TypedAction } from "redoodle";

import { IGraphUser } from "../Components/DisplayGraph/DisplayGraph";
import { IEvent } from "../Types/Events";
import { IFilter, IGraphType } from "../Types/Graph";
import { IUser } from "../Types/Users";

export const SetInfoPerson = TypedAction.define("WebsiteAction//SET_INFO_PERSON")<IUser>();

export const SelectEvent = TypedAction.define("WebsiteAction//SELECT_EVENT")<IEvent | undefined>();

export const SetGraphRef = TypedAction.define(
  "WebsiteAction//SET_GRAPH_REF"
)<HTMLElement | null>();

export const AddGraphFilter = TypedAction.define("WebsiteAction//ADD_GRAPH_FILTER")<IFilter>();

export const RemoveGraphFilter = TypedAction.define("WebsiteAction//REMOVE_GRAPH_FILTER")<string>();

export const ChangeGraphType = TypedAction.define("WebsiteAction//CHANGE_GRAPH_TYPE")<IGraphType>();

export const SetContextMenuNode = TypedAction.define("WebsiteAction//SET_CONTEXT_MENU_NODE")<IGraphUser | undefined>();
