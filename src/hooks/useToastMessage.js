import { useState, useCallback } from "react";

export function useToast(initialDuration = 3000) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [duration, setDuration] = useState(initialDuration);

  const showToast = useCallback((msg, dur = initialDuration) => {
    // If toast is currently visible, hide it briefly to force a new animation
    if (visible) {
      setVisible(false);
      // Use setTimeout to ensure the toast component has time to unmount and remount
      setTimeout(() => {
        setMessage(msg);
        setDuration(dur);
        setVisible(true);
      }, 50); // Small delay to allow animation reset
    } else {
      setMessage(msg);
      setDuration(dur);
      setVisible(true);
    }
  }, [initialDuration, visible]);

  const hideToast = useCallback(() => {
    setVisible(false);
    setMessage("");
  }, []);

  return { visible, message, duration, showToast, hideToast };
}
