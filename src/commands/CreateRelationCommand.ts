import type { IRelation } from "@/contracts/schema";
import { addRelation, deleteRelations } from "@/store/schema/slice";
import type { UnknownAction } from "redux";
import type { ICommand } from "./Command";

export class CreateRelationCommand implements ICommand {
  constructor(private relation: IRelation) {}

  public execute(): UnknownAction {
    return addRelation(this.relation);
  }

  public undo(): UnknownAction {
    return deleteRelations({ relationIds: [this.relation.id] });
  }

  public redo(): UnknownAction {
    return addRelation(this.relation);
  }
}
