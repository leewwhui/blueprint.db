import type { ListenerMiddlewareInstance } from "@reduxjs/toolkit";
import { selectRelation, selectTable } from "./slice";

export const uiListener = (listener: ListenerMiddlewareInstance) => {
  listener.startListening({
    actionCreator: selectTable,
    effect: async (action, listenerApi) => {
      if (action.payload === null) {
        return;
      }

      listenerApi.dispatch(selectRelation(null));
    },
  });

  listener.startListening({
    actionCreator: selectRelation,
    effect: async (action, listenerApi) => {
      if (action.payload === null) {
        return;
      }

      listenerApi.dispatch(selectTable(null));
    },
  });
};
