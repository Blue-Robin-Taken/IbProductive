"use client";

import { ReactElement, useEffect, useState } from "react";

type AddToastEventDetails = {
  type: ToastAlertType;
  body: string;
};

/**
 * The display system for the toast alerts.
 * @returns
 */
export default function ToastSystem() {
  const [alerts, setAlerts] = useState<ReactElement[]>([]);

  useEffect(() => {
    // "reciever": name of the event, how it is handled
    document.addEventListener("add-toast-alert", (event) => {
      if (!("detail" in event)) {
        // checks if detail exists in event
        throw new Error('The "add-toast-alert" event is not custom.');
      }

      const details: AddToastEventDetails = (event as CustomEvent).detail;

      let newToast;
      const key = new Date().getTime() + 5000; // key will be the expiry time
      switch (details.type) {
        case ToastAlertType.SUCCESS:
          newToast = (
            <div key={key} className="alert alert-success">
              {details.body}
            </div>
          );
          break;
        default:
          newToast = (
            <div key={key} className="alert alert-error">
              <p>
                There was an issue with parsing data from the toast event...
                this is a developer problem and not a you problem! 🤪
              </p>
            </div>
          );
      }
      setAlerts((prev) => [...prev, newToast]);

      /* Removes expired alerts every second */
      const interval = setInterval(() => {
        const now: number = new Date().getTime();
        setAlerts((prev) => prev.filter((i) => Number.parseInt(i.key!) > now));
      }, 1000);

      return () => clearInterval(interval);
    });
  }, []);

  return <div className="toast">{alerts}</div>;
}

export function createToastEvent(type: ToastAlertType, body: string) {
  const addToastEvent = new CustomEvent("add-toast-alert", {
    detail: { type: type, body: body },
  });

  document.dispatchEvent(addToastEvent);
}

export enum ToastAlertType {
  SUCCESS,
}
