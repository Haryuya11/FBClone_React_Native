import React, { createContext, useState } from "react";

export const RegisterContext = createContext();
export const RegisterProvider = ({ children }) => {
  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    dateOfBirth: null,
    gender: "",
    phoneNumber: "",
  });
  return (
    <RegisterContext.Provider value={{ registerData, setRegisterData }}>
      {children}
    </RegisterContext.Provider>
  );
};
