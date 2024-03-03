import { SCHEMA_TYPE, SCHEMA_VERSION } from "../constants";
import type { PlayerCharacter } from "../types";

export default async function savePlayerToFile(pc: PlayerCharacter) {
  const suggestedName = pc.name;
  pc = JSON.parse(JSON.stringify(pc));
  pc["schemaVersion"] = SCHEMA_VERSION;
  pc["schemaType"] = SCHEMA_TYPE;

  const blob = new Blob([JSON.stringify(pc, null, 2)], {
    type: "application/json",
  });

  // Feature detection. The API needs to be supported
  // and the app not run in an iframe.
  const supportsFileSystemAccess =
    "showSaveFilePicker" in window &&
    (() => {
      try {
        return window.self === window.top;
      } catch {
        return false;
      }
    })();

  // If the File System Access API is supported…
  if (supportsFileSystemAccess) {
    try {
      // Show the file save dialog.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const handle = await (window as any).showSaveFilePicker({
        suggestedName,
        types: [
          {
            description: "json files",
            accept: { "application/json": [".json"] },
          },
        ],
      });
      // Write the blob to the file.
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return;
    } catch (err) {
      // Fail silently if the user has simply canceled the dialog.
      if (err.name !== "AbortError") {
        console.error(err.name, err.message);
        return;
      }
    }
  }
  // Fallback if the File System Access API is not supported…
  // Create the blob URL.
  const blobURL = URL.createObjectURL(blob);
  // Create the `<a download>` element and append it invisibly.
  const a = document.createElement("a");
  a.href = blobURL;
  a.download = suggestedName;
  a.style.display = "none";
  document.body.append(a);
  // Programmatically click the element.
  a.click();
  // Revoke the blob URL and remove the element.
  setTimeout(() => {
    URL.revokeObjectURL(blobURL);
    a.remove();
  }, 1000);
}
