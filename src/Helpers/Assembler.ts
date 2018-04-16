interface IUser {
    id: string,
    name: string,
    gender: string,
}

class User implements IUser {
    public id: string;
    public name: string;
    public gender: string;

    constructor(id: string, name: string, gender: string){
        this.id = id;
        this.name = name;
        this.gender = gender;
    }
}

export function assembleObjects(googleSheetRawData: string[]): User[] {
    return googleSheetRawData.slice(1).map((singleUser) => {
        return new User(singleUser[0], singleUser[1], singleUser[2]);
    })
}