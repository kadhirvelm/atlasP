import { Dispatch } from "redux";

import Event from "../Helpers/Event";
import { IUser } from "../Helpers/User";
import { FailedDataFetch, StartingDataFetch, SuccessfulDataFetch } from "../State/GoogleSheetActions";

const EVENT_DATA_RANGE = "Events-Data!A1:L100";
const USER_DATA_RANGE = "Users-Data!A1:AZ100";

export class GoogleDispatcher {
    public constructor(private dispatch: Dispatch) {}

    public signIn() {
        window["gapi"].auth2.getAuthInstance().signIn();
    }

    public authorize = (callback: (isSignedIn: boolean) => void) => {
        window["gapi"].load("client:auth2", () => {
          window["gapi"].client
            .init({
              apiKey: process.env.REACT_APP_API_KEY,
              clientId: process.env.REACT_APP_CLIENT_ID,
              discoveryDocs: [
                "https://sheets.googleapis.com/$discovery/rest?version=v4",
              ],
              scope: "https://www.googleapis.com/auth/spreadsheets",
            })
            .then(() => {
                window["gapi"].auth2
                    .getAuthInstance()
                    .isSignedIn.listen(callback);
                callback(window["gapi"].auth2.getAuthInstance().isSignedIn.get());
            });
        });
    }

    public fetchGoogleSheetData = () => {
        this.dispatch(StartingDataFetch.create());
        window["gapi"].client.load("sheets", "v4", () => {
            window["gapi"].client.sheets.spreadsheets.values
            .batchGet({
                ranges: [USER_DATA_RANGE, EVENT_DATA_RANGE],
                spreadsheetId: process.env.REACT_APP_SPREADSHEET,
            })
            .then((response: object) => {
                const rawData = response["result"].valueRanges;
                this.dispatch(
                    SuccessfulDataFetch.create({
                        eventData: this.extractEventsFromRaw(rawData),
                        rawData,
                        userData: this.extractUsersFromRaw(rawData),
                    }),
                );
            })
            .catch((error: any) => {
                this.dispatch(FailedDataFetch.create(error));
            });
        });
    }

    public writeData = async (event: Event, users: IUser[], rawData: any): Promise<boolean> => {
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
                    includeValuesInResponse: true,
                    range: [USER_DATA_RANGE],
                    spreadsheetId: process.env.REACT_APP_SPREADSHEET,
                    valueInputOption: "USER_ENTERED",
                },
                {
                    values: newUserData,
                }
            ).then((response: object) => {
                const newRawData = response["result"].updatedData.values;
                this.dispatch(
                    SuccessfulDataFetch.create({
                        eventData: this.extractEventsFromRaw(rawData),
                        rawData: [newRawData, rawData[1]],
                        userData: newRawData,
                    }),
                );
                return true;
            }).catch((error: any) => {
                console.log(error);
                return false;
            })
    }

    private appendEventToUsers = (eventID: string, users: IUser[], rawData: any) => {
        const userData = this.extractUsersFromRaw(rawData);
        const allUsers = users.map((user) => user.id.toString());
        return userData.slice().map((user) => {
            return allUsers.includes(user[0]) ? user.concat([eventID.toString()]) : user;
        });
    }

    private extractEventsFromRaw = (rawData: any) => rawData[1].values as string[][];
    private extractUsersFromRaw = (rawData: any) => rawData[0].values as string[][];
}