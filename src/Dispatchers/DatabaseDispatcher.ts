import axios from "axios";
import { Dispatch } from "redux";

import { Intent } from "@blueprintjs/core";

import { showToast } from "../Helpers/Toaster";
import { IRawUser, Login } from "../State/DatabaseActions";

export class DatabaseDispatcher {
    public constructor(private dispatch: Dispatch) {}

    public login = async (phoneNumber: string, password: string, temporaryPassword?: string) => {
        const loginResponse = await axios.post(this.retrieveURL("users/login"), { phoneNumber, password, temporaryPassword });
        axios.defaults.headers.common["access-token"] = loginResponse.data.payload.token;
        this.dispatch(Login.create(loginResponse.data.payload.userDetails as IRawUser));
    }

    public claim = async (phoneNumber: string) => {
        try {
            const claimResponse = await axios.post(this.retrieveURL("users/claim"), { phoneNumber });
            this.login(phoneNumber, "", claimResponse.data.payload.temporaryPassword);
        } catch (e) {
            showToast(Intent.DANGER, "Hum, looks like this user either doesn't exist or has already been claimed. Contact an admin if you think this is a mistake.");
        }
    }
    
    private retrieveURL = (endpoint: string) => {
        return process.env.REACT_APP_SERVER_IP + "/" + endpoint;
    }
}
