import { describe, expect, it } from "vitest";
import type { IRelation, ITable } from "@/contracts/schema";
import { relationValidate } from "../lib/relation-validate";
import { ColumnConstraints, FieldType } from "../lib/field-type";

const makeTable = (
  tableId: string,
  colId: string,
  type: FieldType,
  constraints: Partial<Record<ColumnConstraints, boolean>> = {},
): ITable => ({
  id: tableId,
  name: tableId,
  columns: [
    {
      id: colId,
      name: colId,
      type,
      constraints: {
        [ColumnConstraints.PRIMARY_KEY]: false,
        [ColumnConstraints.NOT_NULL]: false,
        [ColumnConstraints.UNIQUE]: false,
        [ColumnConstraints.AUTO_INCREMENT]: false,
        ...constraints,
      },
    },
  ],
});

const validate = (
  source: ITable,
  target: ITable,
  sourceColumnId: string,
  targetColumnId: string,
  relations: IRelation[] = [],
) => {
  return relationValidate(
    source,
    target,
    sourceColumnId,
    targetColumnId,
    source.id,
    target.id,
    relations,
  );
};

describe("relationValidate", () => {
  it("returns invalid when source column is missing", () => {
    const source = makeTable("source", "s1", FieldType.INT);
    const target = makeTable("target", "t1", FieldType.INT, {
      [ColumnConstraints.PRIMARY_KEY]: true,
    });

    const result = validate(source, target, "missing", "t1");

    expect(result).toEqual({
      valid: false,
      message: "Source column not found",
    });
  });

  it("returns invalid when target column is missing", () => {
    const source = makeTable("source", "s1", FieldType.INT);
    const target = makeTable("target", "t1", FieldType.INT, {
      [ColumnConstraints.PRIMARY_KEY]: true,
    });

    const result = validate(source, target, "s1", "missing");

    expect(result).toEqual({
      valid: false,
      message: "Target column not found",
    });
  });

  it("returns invalid when source/target types do not match", () => {
    const source = makeTable("source", "s1", FieldType.INT);
    const target = makeTable("target", "t1", FieldType.VARCHAR, {
      [ColumnConstraints.PRIMARY_KEY]: true,
    });

    const result = validate(source, target, "s1", "t1");

    expect(result).toEqual({
      valid: false,
      message: "Type mismatch: Source and Target must have the same type",
    });
  });

  it("returns invalid when target column is neither PK nor unique", () => {
    const source = makeTable("source", "s1", FieldType.INT);
    const target = makeTable("target", "t1", FieldType.INT);

    const result = validate(source, target, "s1", "t1");

    expect(result).toEqual({
      valid: false,
      message: "Invalid Relation: Target column must be a Primary Key or Unique",
    });
  });

  it("returns valid when types match and target is unique", () => {
    const source = makeTable("source", "s1", FieldType.INT);
    const target = makeTable("target", "t1", FieldType.INT, {
      [ColumnConstraints.UNIQUE]: true,
    });

    const result = validate(source, target, "s1", "t1");

    expect(result).toEqual({
      valid: true,
      message: "Relation is valid",
    });
  });

  it("returns invalid when source and target are the same column", () => {
    const source = makeTable("users", "id", FieldType.INT, {
      [ColumnConstraints.PRIMARY_KEY]: true,
    });

    const result = validate(source, source, "id", "id");

    expect(result).toEqual({
      valid: false,
      message: "Invalid Relation: Source and target column cannot be the same",
    });
  });

  it("returns invalid when identical relation already exists", () => {
    const source = makeTable("orders", "user_id", FieldType.INT);
    const target = makeTable("users", "id", FieldType.INT, {
      [ColumnConstraints.PRIMARY_KEY]: true,
    });

    const existing: IRelation[] = [
      {
        id: "r1",
        sourceTableId: "orders",
        sourceColumnId: "user_id",
        targetTableId: "users",
        targetColumnId: "id",
      },
    ];

    const result = validate(source, target, "user_id", "id", existing);

    expect(result).toEqual({
      valid: false,
      message: "Invalid Relation: Duplicate foreign key relation",
    });
  });

  it("returns invalid when source column already has a foreign key", () => {
    const source = makeTable("orders", "owner_id", FieldType.INT);
    const target = makeTable("users", "id", FieldType.INT, {
      [ColumnConstraints.PRIMARY_KEY]: true,
    });

    const existing: IRelation[] = [
      {
        id: "r1",
        sourceTableId: "orders",
        sourceColumnId: "owner_id",
        targetTableId: "accounts",
        targetColumnId: "id",
      },
    ];

    const result = validate(source, target, "owner_id", "id", existing);

    expect(result).toEqual({
      valid: false,
      message: "Invalid Relation: Source column already has a foreign key",
    });
  });
});
