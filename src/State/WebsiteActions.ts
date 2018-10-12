import { TypedAction } from "redoodle";

import { IEvent } from "../Types/Events";
import { IUser } from "../Types/Users";

export const SetInfoPerson = TypedAction.define("WebsiteReducer//SET_INFO_PERSON")<IUser>();

export const SelectEvent = TypedAction.define("WebsiteReducer//SELECT_EVENT")<IEvent | undefined>();

export const SetGraphRef = TypedAction.define(
  "WebsiteReducer//SET_GRAPH_REF"
)<HTMLElement | null>();
