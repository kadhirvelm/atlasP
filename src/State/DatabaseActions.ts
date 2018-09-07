import { TypedAction } from "redoodle";

import { IForceUpdate, IRawUser } from "../Types/Users";

export const Login = TypedAction.define("DatabaseActions//LOGIN")<IRawUser>();

export const ForceUpdate = TypedAction.define("DatabaseActions//FORCE_UPDATE")<IForceUpdate>();

export const EmptyDatabaseCache = TypedAction.defineWithoutPayload("WebsiteReducer//EMPTY_DATABASE_CACHE")();
