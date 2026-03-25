import type { UnknownAction } from "redux";

export interface ICommand {
  execute(): UnknownAction;
  undo(): UnknownAction;
  redo(): UnknownAction;
}
