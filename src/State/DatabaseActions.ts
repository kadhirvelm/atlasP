import { TypedAction } from "redoodle";

import { IEvent } from "../Types/Events";
import { IForceUpdate } from "../Types/Other";
import { IRawUser, IUser } from "../Types/Users";

export const Login = TypedAction.define("DatabaseActions//LOGIN")<IRawUser>();

export const ForceUpdate = TypedAction.define("DatabaseActions//FORCE_UPDATE")<
  IForceUpdate
>();

export const ClearForceUpdate = TypedAction.defineWithoutPayload(
  "DatabaseAction//FORCE_UPDATE_CLEAR"
)();

export const UpdateUser = TypedAction.define("DatabaseAction//UPDATE_USER")<
  Partial<IUser>
>();

export const UpdateGraph = TypedAction.define("DatabaseAction//UPDATE_GRAPH")<{
  users: IUser[];
  events: IEvent[];
}>();

export const UpdateUserData = TypedAction.define(
  "DatabaseAction//UPDATE_USER_DATA"
)<IUser>();

export const UpdateEventData = TypedAction.define(
  "DatabaseAction//UPDATE_EVENT_DATA"
)<IEvent>();

export const EmptyDatabaseCache = TypedAction.defineWithoutPayload(
  "WebsiteReducer//EMPTY_DATABASE_CACHE"
)();
