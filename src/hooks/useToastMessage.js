import { useState, useCallback } from "react";

export function useToast(initialDuration = 3000) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [duration, setDuration] = useState(initialDuration);

  const showToast = useCallback((msg, dur = initialDuration) => {
    setMessage(msg);
    setDuration(dur);
    setVisible(true);
  }, [initialDuration]);

  const hideToast = useCallback(() => {
    setVisible(false);
    setMessage("");
  }, []);

  return { visible, message, duration, showToast, hideToast };
}
