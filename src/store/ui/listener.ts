import type { ListenerMiddlewareInstance } from "@reduxjs/toolkit";
import { updateTablePosition } from "./slice";

export const uiListener = (listener: ListenerMiddlewareInstance) => {
  listener.startListening({
    actionCreator: updateTablePosition,
    effect: async (action, listenerApi) => {
      console.log(action, listenerApi);
    },
  });
};
