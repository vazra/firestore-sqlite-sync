import app from "./app";

export const authenticateAnonymously = () => {
  return app.auth().signInAnonymously();
};
