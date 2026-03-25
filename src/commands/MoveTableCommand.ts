import type { IVector2 } from "@/contracts/math";
import { updateTablePosition } from "@/store/ui/slice";
import type { UnknownAction } from "redux";
import type { ICommand } from "./Command ";

export class MoveTableCommand implements ICommand {
  constructor(
    private readonly tableId: string,
    private readonly fromPosition: IVector2,
    private readonly toPosition: IVector2,
  ) {}

  public execute(): UnknownAction {
    return updateTablePosition({
      tableId: this.tableId,
      position: { ...this.toPosition },
    });
  }

  public undo(): UnknownAction {
    return updateTablePosition({
      tableId: this.tableId,
      position: { ...this.fromPosition },
    });
  }

  public redo(): UnknownAction {
    return updateTablePosition({
      tableId: this.tableId,
      position: { ...this.toPosition },
    });
  }
}
