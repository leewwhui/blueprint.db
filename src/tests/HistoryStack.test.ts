import { describe, it, expect, vi, beforeEach } from "vitest";
import { HistoryStack } from "@/commands/HistoryStack";
import type { ICommand } from "@/commands/Command";

function createMockCommand(
  executeAction = { type: "EXECUTE" },
  undoAction = { type: "UNDO" },
  redoAction = { type: "REDO" },
): ICommand {
  return {
    execute: vi.fn(() => executeAction),
    undo: vi.fn(() => undoAction),
    redo: vi.fn(() => redoAction),
  };
}

describe("HistoryStack", () => {
  let history: HistoryStack;

  beforeEach(() => {
    history = new HistoryStack();
  });

  describe("initial state", () => {
    it("should have canUndo=false and canRedo=false", () => {
      const snapshot = history.getSnapshot();
      expect(snapshot.canUndo).toBe(false);
      expect(snapshot.canRedo).toBe(false);
    });

    it("undo should return undefined when empty", () => {
      expect(history.undo()).toBeUndefined();
    });

    it("redo should return undefined when empty", () => {
      expect(history.redo()).toBeUndefined();
    });
  });

  describe("executeCommand", () => {
    it("should call execute on the command", () => {
      const cmd = createMockCommand();
      history.executeCommand(cmd);
      expect(cmd.execute).toHaveBeenCalledOnce();
    });

    it("should return the action from execute", () => {
      const action = { type: "TEST_ACTION" };
      const cmd = createMockCommand(action);
      expect(history.executeCommand(cmd)).toEqual(action);
    });

    it("should set canUndo to true after execute", () => {
      history.executeCommand(createMockCommand());
      expect(history.getSnapshot().canUndo).toBe(true);
    });

    it("should clear redo stack after new execute", () => {
      const cmd1 = createMockCommand();
      const cmd2 = createMockCommand();
      history.executeCommand(cmd1);
      history.undo();
      expect(history.getSnapshot().canRedo).toBe(true);

      history.executeCommand(cmd2);
      expect(history.getSnapshot().canRedo).toBe(false);
    });
  });

  describe("undo", () => {
    it("should call undo on the last executed command", () => {
      const cmd = createMockCommand();
      history.executeCommand(cmd);
      history.undo();
      expect(cmd.undo).toHaveBeenCalledOnce();
    });

    it("should return the undo action", () => {
      const undoAction = { type: "MY_UNDO" };
      const cmd = createMockCommand(undefined, undoAction);
      history.executeCommand(cmd);
      expect(history.undo()).toEqual(undoAction);
    });

    it("should make canRedo true and canUndo false after undoing single command", () => {
      history.executeCommand(createMockCommand());
      history.undo();
      const snapshot = history.getSnapshot();
      expect(snapshot.canUndo).toBe(false);
      expect(snapshot.canRedo).toBe(true);
    });

    it("should undo in LIFO order", () => {
      const cmd1 = createMockCommand();
      const cmd2 = createMockCommand();
      history.executeCommand(cmd1);
      history.executeCommand(cmd2);

      history.undo();
      expect(cmd2.undo).toHaveBeenCalledOnce();
      expect(cmd1.undo).not.toHaveBeenCalled();

      history.undo();
      expect(cmd1.undo).toHaveBeenCalledOnce();
    });
  });

  describe("redo", () => {
    it("should call redo on the last undone command", () => {
      const cmd = createMockCommand();
      history.executeCommand(cmd);
      history.undo();
      history.redo();
      expect(cmd.redo).toHaveBeenCalledOnce();
    });

    it("should return the redo action", () => {
      const redoAction = { type: "MY_REDO" };
      const cmd = createMockCommand(undefined, undefined, redoAction);
      history.executeCommand(cmd);
      history.undo();
      expect(history.redo()).toEqual(redoAction);
    });

    it("should restore canUndo after redo", () => {
      history.executeCommand(createMockCommand());
      history.undo();
      history.redo();
      const snapshot = history.getSnapshot();
      expect(snapshot.canUndo).toBe(true);
      expect(snapshot.canRedo).toBe(false);
    });
  });

  describe("maxHistory", () => {
    it("should limit undo stack to maxHistory", () => {
      const smallHistory = new HistoryStack(3);
      for (let i = 0; i < 5; i++) {
        smallHistory.executeCommand(createMockCommand());
      }

      let undoCount = 0;
      while (smallHistory.undo()) {
        undoCount++;
      }
      expect(undoCount).toBe(3);
    });
  });

  describe("clearHistory", () => {
    it("should clear both undo and redo stacks", () => {
      history.executeCommand(createMockCommand());
      history.executeCommand(createMockCommand());
      history.undo();

      history.clearHistory();
      const snapshot = history.getSnapshot();
      expect(snapshot.canUndo).toBe(false);
      expect(snapshot.canRedo).toBe(false);
    });
  });

  describe("subscribe", () => {
    it("should notify listeners on execute", () => {
      const listener = vi.fn();
      history.subscribe(listener);
      history.executeCommand(createMockCommand());
      expect(listener).toHaveBeenCalledOnce();
    });

    it("should notify listeners on undo", () => {
      history.executeCommand(createMockCommand());
      const listener = vi.fn();
      history.subscribe(listener);
      history.undo();
      expect(listener).toHaveBeenCalledOnce();
    });

    it("should notify listeners on redo", () => {
      history.executeCommand(createMockCommand());
      history.undo();
      const listener = vi.fn();
      history.subscribe(listener);
      history.redo();
      expect(listener).toHaveBeenCalledOnce();
    });

    it("should stop notifying after unsubscribe", () => {
      const listener = vi.fn();
      const unsubscribe = history.subscribe(listener);
      unsubscribe();
      history.executeCommand(createMockCommand());
      expect(listener).not.toHaveBeenCalled();
    });

    it("should notify listeners on clearHistory", () => {
      history.executeCommand(createMockCommand());
      const listener = vi.fn();
      history.subscribe(listener);
      history.clearHistory();
      expect(listener).toHaveBeenCalledOnce();
    });
  });
});
