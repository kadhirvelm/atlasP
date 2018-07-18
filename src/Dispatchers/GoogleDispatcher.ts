import { Dispatch } from "redux";

import { IUser } from "../Helpers/User";
import { FailedDataFetch, StartingDataFetch, SuccessfulDataFetch } from "../State/GoogleSheetActions";

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
              scope: "https://www.googleapis.com/auth/spreadsheets.readonly",
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
                ranges: ["Users-Data!A1:Z100", "Events-Data!A1:L100"],
                spreadsheetId: process.env.REACT_APP_SPREADSHEET,
            })
            .then((response: object) => {
            const results = response["result"].valueRanges;
            console.log(results);
            this.dispatch(
                SuccessfulDataFetch.create({
                    eventData: results[1].values,
                    userData: results[0].values,
                }),
            );
            })
            .catch((error: any) => {
                this.dispatch(FailedDataFetch.create(error));
            });
        });
    }

    public writeData = (event: Event, users: IUser[]) => {
        console.log(event, users);
    }
}