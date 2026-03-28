import { configureStore, createListenerMiddleware } from "@reduxjs/toolkit";
import { schemaSlice } from "./schema/slice";
import { schemaListener } from "./schema/listener";
import { uiSlice } from "./ui/slice";
import { uiListener } from "./ui/listener";

const listenerMiddleware = createListenerMiddleware();

schemaListener(listenerMiddleware);
uiListener(listenerMiddleware);

export const store = configureStore({
  reducer: {
    schema: schemaSlice.reducer,
    ui: uiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
