import type { Middleware } from "@reduxjs/toolkit";
import { pushHistory } from "../history/slice";

export const historyMiddleware: Middleware =
  (store) => (next) => (action: any) => {
    const result = next(action);

    if (action.meta?.isCommand) {
      const { future, past } = action.meta;

      const history = {
        type: action.type,
        future: future,
        past: past,
      };

      store.dispatch(pushHistory(history));
    }

    return result;
  };
