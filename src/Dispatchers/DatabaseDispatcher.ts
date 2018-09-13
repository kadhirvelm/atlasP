import axios from "axios";
import { Dispatch } from "redux";

import { Intent } from "@blueprintjs/core";

import { ForceUpdate, Login, UpdateGraph, UpdateUser } from "../State/DatabaseActions";
import { IRawUser, IUser } from "../Types/Users";
import Event from "../Utils/Event";
import { saveAuthenticationToken, securePassword } from "../Utils/Security";
import { showToast } from "../Utils/Toaster";
import User from "../Utils/User";

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
            console.error(error);
        }
    }

    public claim = async (phoneNumber: string) => {
        try {
            const claimResponse = await axios.post(this.retrieveURL("users/claim"), { phoneNumber });
            this.dispatch(ForceUpdate.create({ _id: claimResponse.data.payload._id, fields: "password" }));
            this.login(phoneNumber, undefined, claimResponse.data.payload.temporaryPassword);
        } catch (error) {
            showToast(Intent.DANGER, "Hum, looks like this user either doesn't exist or has already been claimed. Contact an admin if you think this is a mistake.");
            console.error(error);
        }
    }

    public updateUser = async (newUserDetails: IUser) => {
        try {
            const finalUser = {
                age: newUserDetails.age,
                gender: newUserDetails.gender,
                location: newUserDetails.location,
                name: newUserDetails.name,
                password: securePassword(newUserDetails.password),
                phoneNumber: newUserDetails.contact,
            };
            await axios.post(this.retrieveURL("users/update"), finalUser);
            this.dispatch(UpdateUser.create({ ...newUserDetails, password: "" }));
        } catch (error) {
            showToast(Intent.DANGER, `Hum, something went wrong. ${error.response.data.message.join(", ")}.`)
            console.error(error);
        }
    }

    public getGraph = async (user: IUser) => {
        try {
            if (user.connections === undefined || Object.values(user.connections).length === 0) {
                throw new Error(`Cannot fetch for user: ${user}`);
            }
            const [ rawUsers, rawEvents ] = await Promise.all([ axios.post(this.retrieveURL("users/getMany"), { ids: Object.keys(user.connections) }), axios.post(this.retrieveURL("events/getMany"), { eventIds: Object.values(user.connections).reduce((previous, next) => previous.concat(next)) }) ]);
            const users = rawUsers.data.payload.map((rawUser: any) => new User(rawUser._id, rawUser.name, rawUser.gender, rawUser.age, rawUser.location, rawUser.phoneNumber))
            const events = rawEvents.data.payload.map((rawEvent: any) => new Event(rawEvent._id, rawEvent.host, rawEvent.date, rawEvent.description, this.mapToUsers(rawEvent.attendees, users)));
            this.dispatch(UpdateGraph.create({ users, events }))
        } catch (error) {
            showToast(Intent.DANGER, "We were unable to retrieve the requested user.");
            console.error(error);
        }
    }

    private mapToUsers(ids: string[], users: IUser[]) {
        return ids.map(id => users.find(user => user.id === id) as IUser);
    }
    
    private retrieveURL = (endpoint: string) => {
        return process.env.REACT_APP_SERVER_IP + "/" + endpoint;
    }
}
