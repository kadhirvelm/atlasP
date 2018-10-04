import { TypedAction } from "redoodle";

import User from "../Utils/User";

export const SetInfoPerson = TypedAction.define("WebsiteReducer//SET_INFO_PERSON")<User>();

export const SetGraphRef = TypedAction.define(
  "WebsiteReducer//SET_GRAPH_REF"
)<HTMLElement | null>();
