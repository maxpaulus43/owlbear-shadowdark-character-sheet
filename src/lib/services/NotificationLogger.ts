import { writable } from "svelte/store";
import type { Writable } from "svelte/store";

const MAX_NOTIFICATIONS = 50;

type Log = {
  msg: string;
  timestamp: Date;
};

export const Notifications: Writable<Log[]> = writable([]);

export function pushNotification(msg: string) {
  Notifications.update((val) => {
    val.push({ msg, timestamp: new Date() });
    if (val.length > MAX_NOTIFICATIONS) {
      val.shift();
    }
    return val;
  });
}

export function clearNotifications() {
  Notifications.set([]);
}
