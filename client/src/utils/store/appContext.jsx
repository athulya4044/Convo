/* eslint-disable react/prop-types */
import React, { useState } from "react";

export const AppContext = React.createContext({
  email: "",
  streamToken: "",
  isLoggedIn: false,
  loginHandler: () => {},
  logoutHandler: () => {},
});

function getDataFromLocalStorage() {
  const data = localStorage.getItem("loginConfig");
  if (data) {
    const { email, streamToken } = JSON.parse(data);
    return { email, streamToken };
  } else {
    return { email: null, streamToken: null };
  }
}

function AppContextProvider({ children }) {
  const { email: emailFromLS, streamToken: streamTokenFromLS } =
    getDataFromLocalStorage();
  const [email, setEmail] = useState(emailFromLS);
  const [streamToken, setStreamToken] = useState(streamTokenFromLS);

  const isLoggedIn = !!email && !!streamToken;

  function loginHandler(loginConfig) {
    const { email, streamToken } = loginConfig;
    setEmail(email);
    setStreamToken(streamToken);
    const newLoginConfig = {
      email,
      streamToken,
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
        localStorage.removeItem("loginConfig");
      }
    }
  }

  const contextValue = {
    email,
    streamToken,
    isLoggedIn: isLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}

export default AppContextProvider;
