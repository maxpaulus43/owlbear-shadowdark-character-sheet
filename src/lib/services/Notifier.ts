import OBR from "@owlbear-rodeo/sdk";
import { pluginId } from "./OBRHelper";

export const NOTIFICATION_KEY = pluginId("notification");

export async function notifiy(msg: string) {
  if (OBR.isAvailable) {
    const myName = await OBR.player.getName();
    OBR.room.setMetadata({
      [NOTIFICATION_KEY]: `${myName} rolled: ${msg}`,
    });
  } else {
    alert(msg);
  }
}
