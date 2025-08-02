import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [duration, setDuration] = useState(5000);

  const showToast = useCallback((msg, dur = 5000) => {
    console.log("showToast called with message:", msg, "and duration:", dur);
    
    setMessage(msg);
    setDuration(dur);
    setVisible(true);
  }, []);

  const hideToast = useCallback(() => {
    setVisible(false);
    setMessage("");
  }, []);

  return (
    <ToastContext.Provider value={{ visible, message, duration, showToast, hideToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
