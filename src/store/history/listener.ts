import type { ListenerMiddlewareInstance } from "@reduxjs/toolkit";
import { undo } from "./slice";
import type { RootState } from "../store";

export const historyListener = (listener: ListenerMiddlewareInstance) => {
  listener.startListening({
    actionCreator: undo,
    effect: async (action, listenerApi) => {
      const state = listenerApi.getState() as RootState;
      const current = state.history.future[state.history.future.length - 1];
      listenerApi.dispatch(current);
    },
  });
};
