import type { ITable } from "@/contracts/schema";
import { updateTable } from "@/store/schema/slice";
import type { UnknownAction } from "redux";
import type { ICommand } from "./Command";

export class UpdateTableCommand implements ICommand {
  constructor(
    private previousTable: ITable,
    private nextTable: ITable,
  ) {}

  public execute(): UnknownAction {
    return updateTable(this.nextTable);
  }

  public undo(): UnknownAction {
    return updateTable(this.previousTable);
  }

  public redo(): UnknownAction {
    return updateTable(this.nextTable);
  }
}
