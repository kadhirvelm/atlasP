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

export const UpdateOtherUser = TypedAction.define(
  "DatabaseAction//UPDATE_OTHER_USER"
)<{
  userId: string;
  newUserDetails: Pick<IUser, "name" | "gender" | "location">;
}>();

export const UpdateGraph = TypedAction.define("DatabaseAction//UPDATE_GRAPH")<{
  users: IUser[];
  events: IEvent[];
}>();

export const UpdateUserData = TypedAction.define(
  "DatabaseAction//UPDATE_USER_DATA"
)<IUser>();

export const DeleteUser = TypedAction.define("DatabaseAction//DELETE_USER")<
  string
>();

export const UpdateEventData = TypedAction.define(
  "DatabaseAction//UPDATE_EVENT_DATA"
)<IEvent>();

export const DeleteEvent = TypedAction.define("DatabaseAction//DELETE_EVENT")<
  string
>();

export const EmptyDatabaseCache = TypedAction.defineWithoutPayload(
  "WebsiteReducer//EMPTY_DATABASE_CACHE"
)();
