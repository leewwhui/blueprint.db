import { historyStack } from "@/commands/HistoryStack";
import { useSyncExternalStore, useRef } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import type { ICommand } from "@/commands/Command ";

export const useHistory = () => {
  const history = useRef(historyStack);
  const dispatch = useDispatch<AppDispatch>();

  const { canUndo, canRedo } = useSyncExternalStore(
    (listener) => history.current.subscribe(listener),
    () => history.current.getSnapshot(),
  );

  const executeCommand = (command: ICommand) => {
    const action = history.current.executeCommand(command);
    dispatch(action);
  };

  const undo = () => {
    const action = history.current.undo();
    if (!action) return;
    dispatch(action);
  };

  const redo = () => {
    const action = history.current.redo();
    if (!action) return;
    dispatch(action);
  };

  return {
    executeCommand,
    undo,
    redo,
    canUndo,
    canRedo,
  };
};
