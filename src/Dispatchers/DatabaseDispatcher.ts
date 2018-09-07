import axios from "axios";
import { Dispatch } from "redux";

import { Intent } from "@blueprintjs/core";

import { ForceUpdate, Login } from "../State/DatabaseActions";
import { IRawUser } from "../Types/Users";
import { showToast } from "../Utils/Toaster";

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
            this.dispatch(ForceUpdate.create({ _id: claimResponse.data.payload._id, fields: "password" }));
            this.login(phoneNumber, "", claimResponse.data.payload.temporaryPassword);
        } catch (e) {
            showToast(Intent.DANGER, "Hum, looks like this user either doesn't exist or has already been claimed. Contact an admin if you think this is a mistake.");
        }
    }
    
    private retrieveURL = (endpoint: string) => {
        return process.env.REACT_APP_SERVER_IP + "/" + endpoint;
    }
}
