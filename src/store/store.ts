import { configureStore, createListenerMiddleware } from "@reduxjs/toolkit";
import { schemaSlice } from "./schema/slice";
import { schemaListener } from "./schema/listener";
import { uiSlice } from "./ui/slice";
import { historyMiddleware } from "./middlewares/history-middleware";
import { uiListener } from "./ui/listener";
import { historySlice } from "./history/slice";
import { historyListener } from "./history/listener";

const listenerMiddleware = createListenerMiddleware();

schemaListener(listenerMiddleware);
uiListener(listenerMiddleware);
historyListener(listenerMiddleware);

export const store = configureStore({
  reducer: {
    schema: schemaSlice.reducer,
    ui: uiSlice.reducer,
    history: historySlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(listenerMiddleware.middleware)
      .concat(historyMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
