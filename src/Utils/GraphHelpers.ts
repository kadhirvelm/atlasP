import { IScore } from "../Types/Graph";
import User from "./User";

export function calculateScore(user: User, mainPerson: User): IScore {
  const returnEventScore = () =>
    user.connections[mainPerson.id] ? user.connections[mainPerson.id].length : 0;
  const returnGenderScore = () => (user.gender === mainPerson.gender ? 1 : 0);
  const returnAgeScore = (age: number) => (age < 5 ? 1 : age < 15 ? 0 : -1);
  const returnLikeScore = (inputUser: User, checkForUser: User) =>
    inputUser.greenList.includes(checkForUser.id) ? 2 : 1;
  const returnDislikeScore = (inputUser: User, checkForUser: User) =>
    inputUser.redList.includes(checkForUser.id) ? 0.5 : 1;
  const finalTally = {
    ageScore: returnAgeScore(Math.abs(user.age - mainPerson.age)),
    dislikeScore: returnDislikeScore(user, mainPerson) * returnDislikeScore(mainPerson, user),
    eventScore: returnEventScore(),
    genderScore: returnGenderScore(),
    isMain: false,
    // tslint:disable-next-line:trailing-comma
    likeScore: returnLikeScore(user, mainPerson) * returnLikeScore(mainPerson, user)
  };
  return {...finalTally,
    finalScore:
      (finalTally.eventScore + finalTally.genderScore + finalTally.ageScore) *
      returnLikeScore(user, mainPerson) *
      finalTally.likeScore *
      // tslint:disable-next-line:trailing-comma
      finalTally.dislikeScore};
}
