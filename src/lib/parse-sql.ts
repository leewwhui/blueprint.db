import { nanoid } from "nanoid";
import { ColumnConstraints, ColumnType } from "@/contracts/columns";
import type { IColumn, IRelation, ITable } from "@/contracts/schema";
import nodeSqlParser from "node-sql-parser";

interface ParsedSchema {
  tables: ITable[];
  relations: IRelation[];
}

type AstNode = { type?: string };

type SqlColumnRef = {
  column?: string;
};

type SqlDefinition = {
  dataType?: string;
  length?: number | string;
};

type SqlCreateColumnDefinition = {
  resource?: "column";
  column?: SqlColumnRef;
  definition?: SqlDefinition;
  nullable?: { value?: string } | null;
  unique?: string | null;
  auto_increment?: string | null;
  primary_key?: string | null;
};

type SqlCreateConstraintDefinition = {
  resource?: "constraint";
  constraint_type?: string;
  definition?: SqlColumnRef[];
};

type SqlCreateTableAst = AstNode & {
  type: "create";
  keyword?: string;
  table?: Array<{ table?: string }>;
  create_definitions?: Array<
    SqlCreateColumnDefinition | SqlCreateConstraintDefinition
  >;
};

type SqlAlterConstraintDefinition = {
  resource?: "constraint";
  constraint_type?: string;
  definition?: SqlColumnRef[];
  reference_definition?: {
    table?: Array<{ table?: string }>;
    definition?: SqlColumnRef[];
  };
};

type SqlAlterExpression = {
  action?: string;
  create_definitions?: SqlAlterConstraintDefinition;
};

type SqlAlterTableAst = AstNode & {
  type: "alter";
  table?: Array<{ table?: string }>;
  expr?: SqlAlterExpression[];
};

type SqlCreateDefinition =
  | SqlCreateColumnDefinition
  | SqlCreateConstraintDefinition;

const { Parser } = nodeSqlParser;
const parser = new Parser();

const isCreateTableAst = (node: AstNode): node is SqlCreateTableAst => {
  const candidate = node as SqlCreateTableAst;
  return candidate.type === "create" && candidate.keyword === "table";
};

const isAlterTableAst = (node: AstNode): node is SqlAlterTableAst => {
  return node.type === "alter";
};

const isCreateConstraintDefinition = (
  definition: SqlCreateDefinition,
): definition is SqlCreateConstraintDefinition => {
  return definition.resource === "constraint";
};

const isCreateColumnDefinition = (
  definition: SqlCreateDefinition,
): definition is SqlCreateColumnDefinition => {
  return definition.resource === "column";
};

const normalizeAstList = (ast: unknown): AstNode[] => {
  if (!ast) return [];
  if (Array.isArray(ast)) return ast as AstNode[];
  return [ast as AstNode];
};

const mapSqlTypeToColumnType = (sqlType: string): ColumnType => {
  const normalized = sqlType.trim().toUpperCase();

  if (normalized.startsWith("BIGINT")) return ColumnType.BIGINT;
  if (normalized.startsWith("INT") || normalized.startsWith("INTEGER")) return ColumnType.INT;
  if (normalized.startsWith("DECIMAL") || normalized.startsWith("NUMERIC")) return ColumnType.DECIMAL;
  if (normalized.startsWith("VARCHAR")) return ColumnType.VARCHAR;
  if (normalized.startsWith("CHAR(36)")) return ColumnType.UUID;
  if (normalized.startsWith("TEXT")) return ColumnType.TEXT;
  if (normalized === "DATE") return ColumnType.DATE;
  if (normalized.startsWith("DATETIME")) return ColumnType.DATETIME;
  if (normalized.startsWith("TIMESTAMP")) return ColumnType.TIMESTAMP;
  if (
    normalized.startsWith("BOOLEAN") ||
    normalized.startsWith("BOOL") ||
    normalized.startsWith("TINYINT(1)")
  ) {
    return ColumnType.BOOLEAN;
  }
  if (normalized.startsWith("JSON") || normalized.startsWith("JSONB")) return ColumnType.JSON;
  if (normalized.startsWith("UUID")) return ColumnType.UUID;

  return ColumnType.VARCHAR;
};

const getSqlTypeFromDefinition = (definition?: SqlDefinition): string => {
  if (!definition?.dataType) {
    return "VARCHAR";
  }

  if (definition.length == null) {
    return definition.dataType;
  }

  return `${definition.dataType}(${definition.length})`;
};

const parseCreateTableAst = (statement: SqlCreateTableAst): ITable | null => {
  const tableName = statement.table?.[0]?.table;
  if (!tableName) return null;

  const definitions = (statement.create_definitions ?? []) as SqlCreateDefinition[];
  const primaryKeyColumns = new Set<string>();
  const columns: IColumn[] = [];

  definitions.forEach((definition) => {
    if (isCreateConstraintDefinition(definition)) {
      const constraintType = definition.constraint_type?.toLowerCase();
      if (constraintType === "primary key") {
        (definition.definition ?? [])
          .map((columnRef) => columnRef.column)
          .filter((name): name is string => Boolean(name))
          .forEach((name) => primaryKeyColumns.add(name));
      }
      return;
    }

    if (!isCreateColumnDefinition(definition)) {
      return;
    }

    const columnName = definition.column?.column;
    if (!columnName) return;

    const sqlType = getSqlTypeFromDefinition(definition.definition);
    const isNotNull = definition.nullable?.value?.toLowerCase() === "not null";

    columns.push({
      id: nanoid(),
      name: columnName,
      type: mapSqlTypeToColumnType(sqlType),
      constraints: {
        [ColumnConstraints.PRIMARY_KEY]: Boolean(definition.primary_key),
        [ColumnConstraints.NOT_NULL]: isNotNull,
        [ColumnConstraints.UNIQUE]: Boolean(definition.unique),
        [ColumnConstraints.AUTO_INCREMENT]: Boolean(definition.auto_increment),
      },
    });
  });

  columns.forEach((column) => {
    if (primaryKeyColumns.has(column.name)) {
      column.constraints[ColumnConstraints.PRIMARY_KEY] = true;
    }
  });

  return {
    id: nanoid(),
    name: tableName,
    columns,
  };
};

const parseAlterTableAstToRelations = (
  statement: SqlAlterTableAst,
  tables: ITable[],
): IRelation[] => {
  const sourceTableName = statement.table?.[0]?.table;
  if (!sourceTableName) return [];

  const sourceTable = tables.find((table) => table.name === sourceTableName);
  if (!sourceTable) return [];

  return (statement.expr ?? [])
    .filter((item) => item.action === "add")
    .map((item) => item.create_definitions)
    .filter((definition): definition is SqlAlterConstraintDefinition => Boolean(definition))
    .filter((definition) => definition.constraint_type?.toLowerCase() === "foreign key")
    .map((definition) => {
      const sourceColumnName = definition.definition?.[0]?.column;
      const targetTableName = definition.reference_definition?.table?.[0]?.table;
      const targetColumnName = definition.reference_definition?.definition?.[0]?.column;

      if (!sourceColumnName || !targetTableName || !targetColumnName) {
        return null;
      }

      const targetTable = tables.find((table) => table.name === targetTableName);
      if (!targetTable) return null;

      const sourceColumn = sourceTable.columns.find(
        (column) => column.name === sourceColumnName,
      );
      const targetColumn = targetTable.columns.find(
        (column) => column.name === targetColumnName,
      );

      if (!sourceColumn || !targetColumn) {
        return null;
      }

      return {
        id: nanoid(),
        sourceTableId: sourceTable.id,
        sourceColumnId: sourceColumn.id,
        targetTableId: targetTable.id,
        targetColumnId: targetColumn.id,
        name: "",
      } satisfies IRelation;
    })
    .filter((relation): relation is IRelation => Boolean(relation));
};

export const parseSqlToSchema = (sql: string): ParsedSchema => {
  const normalized = sql.trim();
  if (!normalized) {
    return { tables: [], relations: [] };
  }

  let ast: unknown;

  try {
    ast = parser.astify(normalized, { database: "MySQL" });
  } catch {
    throw new Error("Invalid SQL syntax.");
  }

  const statements = normalizeAstList(ast);

  const tables = statements
    .filter(isCreateTableAst)
    .map((statement) => parseCreateTableAst(statement))
    .filter((table): table is ITable => Boolean(table));

  const relations = statements
    .filter(isAlterTableAst)
    .flatMap((statement) => parseAlterTableAstToRelations(statement, tables));

  if (tables.length === 0) {
    throw new Error("No CREATE TABLE statements found.");
  }

  if (
    tables.some(
      (table) =>
        table.columns.length === 0 ||
        table.columns.every((column) => !column.constraints[ColumnConstraints.PRIMARY_KEY]),
    )
  ) {
    throw new Error("Each imported table must include at least one primary key.");
  }

  return {
    tables,
    relations,
  };
};
