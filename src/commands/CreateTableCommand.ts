import type { ITable } from "@/contracts/schema";
import { addTable, deleteTable } from "@/store/schema/slice";
import type { UnknownAction } from "redux";
import type { ICommand } from "./Command";

export class CreateTableCommand implements ICommand {
  constructor(private table: ITable) {}

  public execute(): UnknownAction {
    return addTable(this.table);
  }

  public undo(): UnknownAction {
    return deleteTable({ tableId: this.table.id });
  }

  public redo(): UnknownAction {
    return addTable(this.table);
  }
}