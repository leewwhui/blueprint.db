import type { ITable } from "@/contracts/schema";
import { addTable, deleteTable } from "@/store/schema/slice";
import type { UnknownAction } from "redux";
import type { ICommand } from "./Command";

export class DeleteTableCommand implements ICommand {
  constructor(private table: ITable) {}

  public execute(): UnknownAction {
    return deleteTable({ tableId: this.table.id });
  }

  public undo(): UnknownAction {
    return addTable(this.table);
  }

  public redo(): UnknownAction {
    return deleteTable({ tableId: this.table.id });
  }
}
