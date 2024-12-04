export const setSessionToken = (token) => {
  sessionStorage.setItem("authToken", token);
};

export const getSessionToken = () => {
  return sessionStorage.getItem("authToken");
};

export const clearSessionToken = () => {
  sessionStorage.removeItem("authToken");
};

export const setSessionUser = (user) => {
  sessionStorage.setItem("currUser", user);
};

export const getSessionUser = () => {
  return sessionStorage.getItem("currUser");
};

export const clearSessionUser = () => {
  sessionStorage.removeItem("currUser");
};