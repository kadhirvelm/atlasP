import axios from "axios";
import { CompoundAction } from "redoodle";
import { Dispatch } from "redux";

import { Intent } from "@blueprintjs/core";

import { IFinalEventChecked } from "../Components/Dialogs/AddNewEvent";
import { IFinalPerson } from "../Components/Dialogs/AddNewUser";
import { ClearForceUpdate, ForceUpdate, Login, UpdateEventData, UpdateGraph, UpdateUser, UpdateUserData } from "../State/DatabaseActions";
import { IRawUser, IUser } from "../Types/Users";
import Event from "../Utils/Event";
import { saveAuthenticationToken, securePassword } from "../Utils/Security";
import { showToast } from "../Utils/Toaster";
import User from "../Utils/User";
import { convertPayloadToUser } from "../Utils/Util";

export class DatabaseDispatcher {
    public constructor(private dispatch: Dispatch) {}

    public login = async (phoneNumber: string, password: string | undefined, temporaryPassword?: string) => {
        try {
            const finalPhoneNumber = phoneNumber.match(/\d+/g);
            if (finalPhoneNumber === null) {
                throw new Error("Invalid phone number");
            }
            const loginResponse = await axios.post(this.retrieveURL("users/login"), { phoneNumber: finalPhoneNumber.join(""), password: securePassword(password), temporaryPassword });
            saveAuthenticationToken(loginResponse.data.payload.token);
            this.dispatch(Login.create(loginResponse.data.payload.userDetails as IRawUser));
        } catch (error) {
            showToast(Intent.DANGER, "It doesn't seem like these are valid login credentials.")
        }
    }

    public claim = async (phoneNumber: string) => {
        try {
            const claimResponse = await axios.post(this.retrieveURL("users/claim"), { phoneNumber });
            this.dispatch(ForceUpdate.create({ _id: claimResponse.data.payload._id, fields: "password" }));
            this.login(phoneNumber, undefined, claimResponse.data.payload.temporaryPassword);
        } catch (error) {
            showToast(Intent.DANGER, "Hum, looks like this user either doesn't exist or has already been claimed. Contact an admin if you think this is a mistake.");
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
            this.dispatch(CompoundAction.create([ UpdateUser.create({ ...newUserDetails, password: "" }), ClearForceUpdate.create() ]));
        } catch (error) {
            showToast(Intent.DANGER, `Hum, something went wrong. ${error.response.data.message.join(", ")}.`);
            throw error;
        }
    }

    public getUpdatedUser = async (user: IUser) => {
        try {
            const rawUpdate = await axios.post(this.retrieveURL("users/getOne"), { id: user.id });
            const updatedUser = convertPayloadToUser(rawUpdate.data.payload[0]);
            if (updatedUser === undefined) {
                throw new Error("Latest fetched user is undefined.");
            }
            this.dispatch(UpdateUser.create(updatedUser));
            return updatedUser
        } catch (error) {
            showToast(Intent.DANGER, "Something went wrong, try logging out and refreshing the page.");
            return undefined;
        }
    }

    public getGraph = async (user: IUser | undefined) => {
        try {
            if (user === undefined || user.connections === undefined || Object.values(user.connections).length === 0) {
                throw new Error(`Cannot fetch for user: ${user}`);
            }
            const [ rawUsers, rawEvents ] = await Promise.all([ axios.post(this.retrieveURL("users/getMany"), { ids: Object.keys(user.connections) }), axios.post(this.retrieveURL("events/getMany"), { eventIds: Object.values(user.connections).reduce((previous, next) => previous.concat(next)) }) ]);
            const users = rawUsers.data.payload.map((rawUser: any) => new User(rawUser._id, rawUser.name, rawUser.gender, rawUser.age, rawUser.location, rawUser.phoneNumber))
            const events = rawEvents.data.payload.map((rawEvent: any) => new Event(rawEvent._id, this.mapToUsers([ rawEvent.host ], users)[0], new Date(rawEvent.date), rawEvent.description, this.mapToUsers(rawEvent.attendees, users)));
            this.dispatch(UpdateGraph.create({ users, events }))
        } catch (error) {
            showToast(Intent.DANGER, "We were unable to retrieve your graph. Try logging out or refreshing the page?");
        }
    }

    public getLatestGraph = async (user: IUser) => {
        const latestUser = await this.getUpdatedUser(user);
        if (latestUser === undefined) {
            return;
        }
        await this.getGraph(convertPayloadToUser(latestUser));
    }

    public createNewUser = async (user: IFinalPerson) => {
        try {
            const response = await axios.post(this.retrieveURL("users/new-user"), { phoneNumber: "", ...user });
            this.dispatch(UpdateUserData.create(new User(response.data.payload.newUserId, user.name, user.gender, parseInt(user.age, 10), user.location, "")))
        } catch (error) {
            showToast(Intent.DANGER, `There was a problem creating this user. ${error.response.data.message.join(", ")}`);
            throw error;
        }
    }

    public createNewEvent = async (event: IFinalEventChecked) => {
        try {
            const response = await axios.post(this.retrieveURL("events/new"), { ...event, attendees: event.attendees.map(user => user.id), host: event.host.id });
            this.dispatch(UpdateEventData.create(new Event(response.data.payload.id, event.host, new Date(event.date), event.description, event.attendees)));
        } catch (error) {
            showToast(Intent.DANGER, `Looks like there's something missing from the event: ${error.response.data.message.join(", ")}`);
            throw error;
        }
    }

    private mapToUsers(ids: string[], users: IUser[]) {
        return ids.map(id => users.find(user => user.id === id) as IUser);
    }
    
    private retrieveURL = (endpoint: string) => {
        return process.env.REACT_APP_SERVER_IP + "/" + endpoint;
    }
}
