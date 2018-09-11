import axios from "axios";
import { createHash } from "crypto";

import { retrieveToken, saveToken } from "../State/StoreCache";

export function getAuthenticationToken() {
  const authToken = retrieveToken();
  axios.defaults.headers.common["access-token"] = authToken;
}

export function saveAuthenticationToken(newToken: string) {
  saveToken(newToken);
  getAuthenticationToken();
}

export function securePassword(password: string | undefined) {
  if (password === undefined) {
    return undefined;
  }
  return createHash("sha256")
    .update(password)
    .digest("hex");
}
