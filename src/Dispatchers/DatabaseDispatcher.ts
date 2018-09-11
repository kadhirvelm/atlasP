import axios from "axios";
import { Dispatch } from "redux";

import { Intent } from "@blueprintjs/core";

import { ForceUpdate, Login, UpdateUser } from "../State/DatabaseActions";
import { IRawUser, IUser } from "../Types/Users";
import { saveAuthenticationToken, securePassword } from "../Utils/Security";
import { showToast } from "../Utils/Toaster";

export class DatabaseDispatcher {
    public constructor(private dispatch: Dispatch) {}

    public login = async (phoneNumber: string, password: string | undefined, temporaryPassword?: string) => {
        try {
            const loginResponse = await axios.post(this.retrieveURL("users/login"), { phoneNumber, password: securePassword(password), temporaryPassword });
            saveAuthenticationToken(loginResponse.data.payload.token);
            console.log(loginResponse);
            this.dispatch(Login.create(loginResponse.data.payload.userDetails as IRawUser));
        } catch (error) {
            showToast(Intent.DANGER, "It doesn't seem like these are valid login credentials.")
            throw error;
        }
    }

    public claim = async (phoneNumber: string) => {
        try {
            const claimResponse = await axios.post(this.retrieveURL("users/claim"), { phoneNumber });
            this.dispatch(ForceUpdate.create({ _id: claimResponse.data.payload._id, fields: "password" }));
            this.login(phoneNumber, undefined, claimResponse.data.payload.temporaryPassword);
        } catch (error) {
            showToast(Intent.DANGER, "Hum, looks like this user either doesn't exist or has already been claimed. Contact an admin if you think this is a mistake.");
            throw error;
        }
    }

    public updateUser = async (newUserDetails: IUser) => {
        try {
            const finalUser = {
                age: newUserDetails.age,
                gender: newUserDetails.gender,
                location: newUserDetails.location,
                name: newUserDetails.fullName,
                password: securePassword(newUserDetails.password),
                phoneNumber: newUserDetails.contact,
            };
            await axios.post(this.retrieveURL("users/update"), finalUser);
            this.dispatch(UpdateUser.create({ ...newUserDetails, password: "" }));
        } catch (error) {
            showToast(Intent.DANGER, `Hum, something went wrong. ${error.response.data.message.join(", ")}.`)
            throw error
        }
    }

    public getGraph = async (user: IUser) => {
        try {
            const [ users, events ] = await Promise.all([ axios.post(this.retrieveURL("users/getMany"), { ids: Object.keys(user.connections) }), axios.post(this.retrieveURL("events/getMany"), { eventIds: Object.values(user.connections).reduce((previous, next) => previous.concat(next)) }) ]);
            console.log(users, events);
        } catch (error) {
            showToast(Intent.DANGER, "We were unable to retrieve the requested user.");
            throw error;
        }
    }
    
    private retrieveURL = (endpoint: string) => {
        return process.env.REACT_APP_SERVER_IP + "/" + endpoint;
    }
}
