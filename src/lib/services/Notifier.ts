import OBR from "@owlbear-rodeo/sdk";

export function notifiy(msg: string) {
  OBR.notification.show(msg).catch(() => {
    alert(msg);
  });
}
