import { IScore } from "../Types/Graph";
import { IUser } from "../Types/Users";

export function calculateScore(user: IUser, mainPerson: IUser): IScore {
  const returnEventScore = () => 1
    // user.connections[mainPerson.id] ? user.connections[mainPerson.id].length : 0;
  const returnGenderScore = () => (user.gender === mainPerson.gender ? 1 : 0);
  const returnAgeScore = (age: number) => (age < 5 ? 1 : age < 15 ? 0 : -1);
  const returnLikeScore = () => 1 // (inputUser: IUser, checkForUser: IUser) => 1
    // inputUser.greenList.includes(checkForUser.id) ? 2 : 1;
  const returnDislikeScore = () => 1 // (inputUser: IUser, checkForUser: IUser) => 1
    // inputUser.redList.includes(checkForUser.id) ? 0.5 : 1;
  const finalTally = {
    ageScore: returnAgeScore(Math.abs(user.age - mainPerson.age)),
    dislikeScore: returnDislikeScore() * returnDislikeScore(),
    eventScore: returnEventScore(),
    genderScore: returnGenderScore(),
    isMain: false,
    // tslint:disable-next-line:trailing-comma
    likeScore: returnLikeScore() * returnLikeScore()
  };
  return {
    ...finalTally,
    finalScore:
      (finalTally.eventScore + finalTally.genderScore + finalTally.ageScore) *
      returnLikeScore() *
      finalTally.likeScore *
      // tslint:disable-next-line:trailing-comma
      finalTally.dislikeScore
  };
}
