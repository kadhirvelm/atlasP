import User from './User';

export interface IScore {
    isHost: boolean;
    eventScore: number;
    genderScore: number;
    ageScore: number;
    likeScore: number;
    dislikeScore: number;
    finalScore: number;
}

export function calculateScore(user: User, mainPerson: User): IScore {
    const returnEventScore = () => user.connections[mainPerson.id] ? user.connections[mainPerson.id].length : 0;
    const returnGenderScore = (gender: string) => user.gender === mainPerson.gender ? 1 : 0;
    const returnAgeScore = (age: number) => age < 5 ? 1 : (age < 15 ? 0 : -1);
    const returnLikeScore = (inputUser: User, checkForUser: User) => inputUser.greenList.includes(checkForUser.id) ? 2 : 1;
    const returnDislikeScore = (inputUser: User, checkForUser: User) => inputUser.redList.includes(checkForUser.id) ? 0.5 : 1;
    const finalTally = { isHost: false, eventScore: returnEventScore(), genderScore: returnGenderScore(user.gender), ageScore: returnAgeScore(Math.abs(user.age - mainPerson.age)), likeScore: returnLikeScore(user, mainPerson) * returnLikeScore(mainPerson, user), dislikeScore: returnDislikeScore(user, mainPerson) * returnDislikeScore(mainPerson, user) };
    return Object.assign({}, finalTally, {
        finalScore: (finalTally.eventScore + finalTally.genderScore + finalTally.ageScore) * returnLikeScore(user, mainPerson) * finalTally.likeScore * finalTally.dislikeScore
    });
}