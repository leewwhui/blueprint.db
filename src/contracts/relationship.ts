export enum ForeignKeyCardinality {
  ONE_TO_ONE = "one-to-one",
  ONE_TO_MANY = "one-to-many",
  MANY_TO_ONE = "many-to-one",
  MANY_TO_MANY = "many-to-many",
}

export enum ForeignKeyReferentialAction {
  NO_ACTION = "No Action",
  RESTRICT = "Restrict",
  CASCADE = "Cascade",
  SET_NULL = "Set Null",
  SET_DEFAULT = "Set Default",
}

export interface RelationshipFormValues {
  cardinality: ForeignKeyCardinality;
  onUpdate: ForeignKeyReferentialAction;
  onDelete: ForeignKeyReferentialAction;
}
