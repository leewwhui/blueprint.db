import { updateTablePosition } from "@/store/ui/slice";
import type { UnknownAction } from "redux";
import type { ICommand } from "./Command";
import type { TablePositionUpdate } from "@/store/ui/reducer";

export class MoveTableCommand implements ICommand {
  constructor(
    private fromMovePositionPayload: TablePositionUpdate[],
    private toMovePositionPayload: TablePositionUpdate[],
  ) {}

  public execute(): UnknownAction {
    return updateTablePosition(this.toMovePositionPayload);
  }

  public undo(): UnknownAction {
    return updateTablePosition(this.fromMovePositionPayload);
  }

  public redo(): UnknownAction {
    return updateTablePosition(this.toMovePositionPayload);
  }
}
