import { Parser } from "node-sql-parser";
import { nanoid } from "nanoid";
import { ColumnConstraints, ColumnType } from "@/contracts/columns";
import {
  ForeignKeyCardinality,
  ForeignKeyReferentialAction,
} from "@/contracts/relationship";
import type { IColumn, IRelation, ITable } from "@/contracts/schema";

const SQL_TYPE_MAP: Record<string, ColumnType> = {
  int: ColumnType.INT,
  integer: ColumnType.INT,
  bigint: ColumnType.BIGINT,
  decimal: ColumnType.DECIMAL,
  numeric: ColumnType.DECIMAL,
  float: ColumnType.DECIMAL,
  double: ColumnType.DECIMAL,
  real: ColumnType.DECIMAL,
  varchar: ColumnType.VARCHAR,
  char: ColumnType.VARCHAR,
  text: ColumnType.TEXT,
  tinytext: ColumnType.TEXT,
  mediumtext: ColumnType.TEXT,
  longtext: ColumnType.TEXT,
  date: ColumnType.DATE,
  datetime: ColumnType.DATETIME,
  timestamp: ColumnType.TIMESTAMP,
  boolean: ColumnType.BOOLEAN,
  bool: ColumnType.BOOLEAN,
  tinyint: ColumnType.BOOLEAN,
  json: ColumnType.JSON,
  jsonb: ColumnType.JSON,
  uuid: ColumnType.UUID,
};

const REFERENTIAL_ACTION_MAP: Record<string, ForeignKeyReferentialAction> = {
  "no action": ForeignKeyReferentialAction.NO_ACTION,
  restrict: ForeignKeyReferentialAction.RESTRICT,
  cascade: ForeignKeyReferentialAction.CASCADE,
  "set null": ForeignKeyReferentialAction.SET_NULL,
  "set default": ForeignKeyReferentialAction.SET_DEFAULT,
};

function normalizeColumnType(dataType: string): ColumnType {
  const key = dataType.toLowerCase().replace(/\(.*\)/, "").trim();
  return SQL_TYPE_MAP[key] ?? ColumnType.VARCHAR;
}

function parseReferentialAction(
  action: string | undefined | null,
): ForeignKeyReferentialAction {
  if (!action) return ForeignKeyReferentialAction.NO_ACTION;
  return (
    REFERENTIAL_ACTION_MAP[action.toLowerCase()] ??
    ForeignKeyReferentialAction.NO_ACTION
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ASTNode = Record<string, any>;

export const parseSqlToSchema = (
  sql: string,
): { tables: ITable[]; relations: IRelation[] } => {
  if (!sql.trim()) return { tables: [], relations: [] };

  const parser = new Parser();
  const ast = parser.astify(sql, { database: "MySQL" });
  const statements = Array.isArray(ast) ? ast : [ast];

  const tables: ITable[] = [];
  const relations: IRelation[] = [];
  const tableMap = new Map<string, ITable>();

  // Pass 1: CREATE TABLE
  for (const stmt of statements as ASTNode[]) {
    if (stmt.type !== "create" || stmt.keyword !== "table") continue;

    const tableName = stmt.table?.[0]?.table ?? "";
    if (!tableName) continue;

    const tableId = nanoid();
    const columns: IColumn[] = [];
    const createDefs: ASTNode[] = stmt.create_definitions ?? [];

    // Collect table-level PRIMARY KEY columns
    const tableLevelPKs = new Set<string>();
    for (const def of createDefs) {
      if (
        def.resource === "constraint" &&
        def.constraint_type === "primary key"
      ) {
        for (const pk of def.definition ?? []) {
          if (pk.column) tableLevelPKs.add(pk.column.toLowerCase());
        }
      }
    }

    for (const def of createDefs) {
      if (def.resource !== "column") continue;

      const name: string = def.column?.column ?? "";
      if (!name) continue;

      const dataType: string = def.definition?.dataType ?? "varchar";

      // node-sql-parser puts these as top-level fields on the column def
      const isPK =
        def.primary_key === "primary key" ||
        tableLevelPKs.has(name.toLowerCase());
      const isNotNull = def.nullable?.value === "not null";
      const isUnique = def.unique === "unique";
      const isAutoIncrement = def.auto_increment === "auto_increment";

      columns.push({
        id: nanoid(),
        name,
        type: normalizeColumnType(dataType),
        constraints: {
          [ColumnConstraints.PRIMARY_KEY]: isPK,
          [ColumnConstraints.NOT_NULL]: isNotNull,
          [ColumnConstraints.UNIQUE]: isUnique,
          [ColumnConstraints.AUTO_INCREMENT]: isAutoIncrement,
        },
      });
    }

    const table: ITable = { id: tableId, name: tableName, columns };
    tables.push(table);
    tableMap.set(tableName.toLowerCase(), table);
  }

  // Pass 2: ALTER TABLE ... ADD CONSTRAINT ... FOREIGN KEY
  for (const stmt of statements as ASTNode[]) {
    if (stmt.type !== "alter") continue;

    const tableName: string = stmt.table?.[0]?.table ?? "";
    if (!tableName) continue;

    const sourceTable = tableMap.get(tableName.toLowerCase());
    if (!sourceTable) continue;

    for (const expr of stmt.expr ?? []) {
      if (expr.action !== "add" || expr.resource !== "constraint") continue;

      const constraintDef: ASTNode | undefined = expr.create_definitions;
      if (!constraintDef || constraintDef.constraint_type !== "FOREIGN KEY")
        continue;

      extractForeignKey(constraintDef, sourceTable, tableMap, relations);
    }
  }

  return { tables, relations };
};

function extractForeignKey(
  def: ASTNode,
  sourceTable: ITable,
  tableMap: Map<string, ITable>,
  relations: IRelation[],
) {
  const fkColumns: ASTNode[] = def.definition ?? [];
  const refDef: ASTNode | undefined = def.reference_definition;

  if (!fkColumns[0]?.column || !refDef) return;

  const sourceColName: string = fkColumns[0].column;
  const targetTableName: string = refDef.table?.[0]?.table ?? "";
  const targetColName: string = refDef.definition?.[0]?.column ?? "";

  if (!targetTableName || !targetColName) return;

  const targetTable = tableMap.get(targetTableName.toLowerCase());
  if (!targetTable) return;

  const sourceColumn = sourceTable.columns.find(
    (c) => c.name.toLowerCase() === sourceColName.toLowerCase(),
  );
  const targetColumn = targetTable.columns.find(
    (c) => c.name.toLowerCase() === targetColName.toLowerCase(),
  );
  if (!sourceColumn || !targetColumn) return;

  // Parse ON DELETE / ON UPDATE
  let onDelete = ForeignKeyReferentialAction.NO_ACTION;
  let onUpdate = ForeignKeyReferentialAction.NO_ACTION;

  for (const action of refDef.on_action ?? []) {
    // node-sql-parser: type is "on delete" / "on update", value is {type, value}
    const actionValue =
      typeof action.value === "string" ? action.value : action.value?.value;
    if (action.type === "on delete") {
      onDelete = parseReferentialAction(actionValue);
    } else if (action.type === "on update") {
      onUpdate = parseReferentialAction(actionValue);
    }
  }

  relations.push({
    id: nanoid(),
    sourceTableId: sourceTable.id,
    sourceColumnId: sourceColumn.id,
    targetTableId: targetTable.id,
    targetColumnId: targetColumn.id,
    cardinality: ForeignKeyCardinality.MANY_TO_ONE,
    onUpdate,
    onDelete,
  });
}