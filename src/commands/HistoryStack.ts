import type { UnknownAction } from "redux";
import type { ICommand } from "./Command";

export type HistorySnapshot = {
  canUndo: boolean;
  canRedo: boolean;
};

export class HistoryStack {
  private undoStack: ICommand[] = [];
  private redoStack: ICommand[] = [];
  private maxHistory: number;
  private listeners = new Set<() => void>();
  private snapshot: HistorySnapshot = { canUndo: false, canRedo: false };

  constructor(maxHistory: number = 20) {
    this.maxHistory = maxHistory;
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public getSnapshot(): HistorySnapshot {
    return this.snapshot;
  }

  private notify() {
    this.snapshot = {
      canUndo: this.undoStack.length > 0,
      canRedo: this.redoStack.length > 0,
    };
    this.listeners.forEach((l) => l());
  }

  public executeCommand(command: ICommand): UnknownAction {
    const action = command.execute();

    this.undoStack.push(command);

    if (this.undoStack.length > this.maxHistory) {
      this.undoStack.shift();
    }

    this.redoStack = [];
    this.notify();

    return action;
  }

  public undo(): UnknownAction | undefined {
    if (this.undoStack.length === 0) return;
    const command = this.undoStack.pop()!;
    const action = command.undo();
    this.redoStack.push(command);
    this.notify();
    return action;
  }

  public redo(): UnknownAction | undefined {
    if (this.redoStack.length === 0) return;
    const command = this.redoStack.pop()!;
    const action = command.redo();
    this.undoStack.push(command);
    this.notify();
    return action;
  }

  public clearHistory() {
    this.undoStack = [];
    this.redoStack = [];
    this.notify();
  }
}

export const historyStack = new HistoryStack();
