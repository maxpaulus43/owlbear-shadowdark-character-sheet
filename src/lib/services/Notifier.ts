import OBR from "@owlbear-rodeo/sdk";
import { pluginId } from "./OBRHelper";

export const NOTIFICATION_KEY = pluginId("notification");

export type NotifyOptions = {
  secret?: boolean;
};

export async function notifiy(msg: string, options: NotifyOptions = {}) {
  if (!OBR.isAvailable) {
    alert(msg);
    return;
  }

  const myName = await OBR.player.getName();
  const m = `${myName}: ${msg}`;

  if (options.secret) {
    notifySecretly(m);
  } else {
    OBR.broadcast.sendMessage(NOTIFICATION_KEY, m);
    showPopover(m);
  }
}

export function notifySecretly(msg: string) {
  showPopover("Secret: " + msg);
}

let timeoutHandle: NodeJS.Timeout;

export async function showPopover(msg: string) {
  const popoverId = pluginId("popover");
  if (timeoutHandle) {
    clearTimeout(timeoutHandle);
    timeoutHandle = null;
  }
  try {
    await OBR.popover.open({
      id: popoverId,
      url: `/popover.html?msg=${encodeURIComponent(msg)}`,
      height: 100,
      width: 400,
    });
    timeoutHandle = setTimeout(() => {
      OBR.popover.close(popoverId);
    }, 5000);
  } catch {
    alert(msg);
  }
}
