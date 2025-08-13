import React, { createContext, useContext } from "react";
import { useToast } from "../hooks/useToastMessage";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const toast = useToast();
  return (
    <ToastContext.Provider value={toast}>{children}</ToastContext.Provider>
  );
};

export const useToastContext = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToastContext must be used within a ToastProvider");
  return ctx;
};
