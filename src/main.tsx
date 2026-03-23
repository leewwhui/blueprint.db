import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <StrictMode>
      <TooltipProvider>
        <App />
      </TooltipProvider>
      <Toaster />
    </StrictMode>
  </Provider>,
);
