import React, { useState } from "react";

export const AppContext = React.createContext({
  email: "",
  isLoggedIn: false,
  loginHandler: (loginObj) => {},
  logoutHandler: () => {},
});

function getDataFromLocalStorage() {
  const data = localStorage.getItem("loginConfig");
  if (data) {
    const { email } = JSON.parse(data);
    return { email };
  } else {
    return { email: null };
  }
}

function AppContextProvider({ children }) {
  const { email: emailFromLS } = getDataFromLocalStorage();
  const [email, setEmail] = useState(emailFromLS);

  const isLoggedIn = !!email;

  function loginHandler(loginConfig) {
    const { email } = loginConfig;
    setEmail(email);
    const newLoginConfig = {
      email,
    };
    localStorage.setItem("loginConfig", JSON.stringify(newLoginConfig));
  }

  function logoutHandler() {
    if (isLoggedIn) {
      const response = window.confirm("Are you sure you want to LOGOUT ?");
      if (response) {
        setEmail(null);
        localStorage.removeItem("loginConfig");
      }
    }
  }

  const contextValue = {
    email,
    isLoggedIn: isLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}

export default AppContextProvider;
