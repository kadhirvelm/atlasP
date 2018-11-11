export const retrieveURL = (endpoint: string) => {
  return process.env.REACT_APP_SERVER_IP + "/" + endpoint;
};
