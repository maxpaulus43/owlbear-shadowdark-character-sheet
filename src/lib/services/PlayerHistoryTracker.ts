import { get, writable } from "svelte/store";
import type { Writable, Readable } from "svelte/store";
import { debounce } from "../utils";

const MAX_HISTORY_ENTRIES = 100;

export type UndoRedoStore<T> = Readable<T> &
  Pick<Writable<T>, "set"> & {
    canUndo: Writable<boolean>;
    canRedo: Writable<boolean>;
    undo: () => void;
    redo: () => void;
  };

export function createUndoRedoStore<T>(store: Writable<T>): UndoRedoStore<T> {
  const history = [get(store)];
  let historyIndex = 0;
  const canUndo = writable(false);
  const canRedo = writable(false);

  const addHistoryEntry = debounce((newValue: T) => {
    historyIndex++;
    history[historyIndex] = JSON.parse(JSON.stringify(newValue));
    while (historyIndex < history.length - 1) {
      history.pop();
    }

    if (history.length > MAX_HISTORY_ENTRIES) {
      history.splice(0, 1);
      historyIndex = Math.max(0, historyIndex - 1);
    }

    canUndo.set(true);
    canRedo.set(false);
  }, 1000);

  return {
    subscribe: store.subscribe,
    canUndo,
    canRedo,
    set: (newValue: T) => {
      addHistoryEntry(newValue);
      store.set(newValue);
    },
    undo: () => {
      if (historyIndex === 0) return;

      historyIndex--;

      if (historyIndex === 0) {
        canUndo.set(false);
      }
      canRedo.set(true);
      store.set(history[historyIndex]);
    },
    redo: () => {
      if (historyIndex >= history.length - 1) return;

      historyIndex++;

      if (historyIndex >= history.length - 1) {
        canRedo.set(false);
      }

      canUndo.set(true);
      store.set(history[historyIndex]);
    },
  };
}
