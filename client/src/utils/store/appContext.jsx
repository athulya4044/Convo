/* eslint-disable react/prop-types */
import React, { useState } from "react";

export const AppContext = React.createContext({
  email: "",
  userType: "",
  streamToken: "",
  isLoggedIn: false,
  loginHandler: () => {},
  logoutHandler: () => {},
});

function getDataFromLocalStorage() {
  const data = localStorage.getItem("loginConfig");
  if (data) {
    const { email, streamToken, userType } = JSON.parse(data);
    return { email, streamToken, userType };
  } else {
    return { email: null, streamToken: null, userType: null };
  }
}

function AppContextProvider({ children }) {
  const {
    email: emailFromLS,
    streamToken: streamTokenFromLS,
    userType: userTypeFromLS,
  } = getDataFromLocalStorage();
  const [email, setEmail] = useState(emailFromLS);
  const [streamToken, setStreamToken] = useState(streamTokenFromLS);
  const [userType, setUserType] = useState(userTypeFromLS);

  const isLoggedIn = !!email && !!streamToken;

  function loginHandler(loginConfig) {
    const { email, streamToken, userType } = loginConfig;
    setEmail(email);
    setStreamToken(streamToken);
    setUserType(userType);
    const newLoginConfig = {
      email,
      streamToken,
      userType,
    };
    localStorage.setItem("loginConfig", JSON.stringify(newLoginConfig));
  }

  function logoutHandler(client) {
    if (isLoggedIn) {
      const response = window.confirm("Are you sure you want to LOGOUT ?");
      if (response) {
        client.disconnectUser();
        setEmail(null);
        setStreamToken(null);
        setUserType(null);
        localStorage.removeItem("loginConfig");
      }
    }
  }

  const contextValue = {
    email,
    streamToken,
    userType,
    isLoggedIn: isLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}

export default AppContextProvider;
