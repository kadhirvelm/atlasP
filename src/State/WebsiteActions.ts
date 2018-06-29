import { TypedAction } from "redoodle";

import User from "../Helpers/User";

export const SetMainPerson = TypedAction.define("WebsiteReducer//SET_MAIN_PERSON")<User>();

export const SetInfoPerson = TypedAction.define("WebsiteReducer//SET_INFO_PERSON")<User>();

export const ChangeParty = TypedAction.define("WebsiteReducer//CHANGE_PARTY")<string[]>();

export const SetGraphRef = TypedAction.define(
  "WebsiteReducer//SET_GRAPH_REF",
)<HTMLElement | null>();
