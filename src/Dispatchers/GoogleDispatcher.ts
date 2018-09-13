import { IFinalPerson } from "../Components/Dialogs/AddNewUser";
import { IUser } from "../Types/Users";
import Event from "../Utils/Event";

const EVENT_DATA_RANGE = "Events-Data!A1:L1000";
const USER_DATA_RANGE = "Users-Data!A1:ZZ1000";

export class GoogleDispatcher {

    public fetchGoogleSheetData = () => {
        window["gapi"].client.load("sheets", "v4", () => {
            window["gapi"].client.sheets.spreadsheets.values
            .batchGet({
                ranges: [USER_DATA_RANGE, EVENT_DATA_RANGE],
                spreadsheetId: process.env.REACT_APP_SPREADSHEET,
            })
            .then((response: object) => {
                const rawData = response["result"].valueRanges;
                console.log(rawData);
            })
            .catch((error: any) => {
                console.error(error);
            });
        });
    }
    
    public writeNewUserData = async (user: IFinalPerson, rawData: any): Promise<boolean> => {
        const users = this.extractUsersFromRaw(rawData);
        return window["gapi"].client.sheets.spreadsheets.values
            .append({
                range: [USER_DATA_RANGE],
                resource: {
                    values: [
                        [
                            999 + users.length,
                            user.fullName,
                            user.gender,
                            user.age,
                            user.location
                        ]
                    ]
                },
                spreadsheetId: process.env.REACT_APP_SPREADSHEET,
                valueInputOption: "USER_ENTERED",
            }).then(() => {
                this.fetchGoogleSheetData();
                return true;
            }).catch((error: any) => {
                console.error(error);
                return false;
            });
    }

    public writeEventData = async (event: Event, users: IUser[], rawData: any): Promise<boolean> => {
        const success = await this.writeEvent(event) && await this.writeUsers(event.id, users, rawData);
        if (success) {
            this.fetchGoogleSheetData();
        }
        return success
    }

    private writeEvent = async (event: Event): Promise<boolean> => {
        return window["gapi"].client.sheets.spreadsheets.values
            .append({
                range: [EVENT_DATA_RANGE],
                resource: {
                    values: [
                        [
                            event.id,
                            event.host,
                            event.date,
                            ...",".repeat(7).split(","),
                            event.description
                        ]
                    ],
                },
                spreadsheetId: process.env.REACT_APP_SPREADSHEET,
                valueInputOption: "USER_ENTERED",
            }).then(() => {
                return true;
            }).catch(() => {
                return false;
            });
    }

    private writeUsers = async (eventID: string, users: IUser[], rawData: any): Promise<boolean> => {
        const newUserData = this.appendEventToUsers(eventID, users, rawData);
        return window["gapi"].client.sheets.spreadsheets.values
            .update(
                {
                    range: [USER_DATA_RANGE],
                    spreadsheetId: process.env.REACT_APP_SPREADSHEET,
                    valueInputOption: "USER_ENTERED",
                },
                {
                    values: newUserData,
                }
            ).then(() => {
                return true;
            }).catch((error: any) => {
                console.error(error);
                return false;
            })
    }

    private appendEventToUsers = (eventID: string, users: IUser[], rawData: any) => {
        const userData = this.extractUsersFromRaw(rawData);
        const allUsers = users.map((user) => user.id.toString());
        return userData.slice().map((user) => {
            return allUsers.includes(user[0]) ? user.concat([...(",".repeat(Math.max(8 - user.length, 0)) + eventID.toString()).split(",")]) : user;
        });
    }

    private extractUsersFromRaw = (rawData: any) => rawData[0].values as string[][];
}
