import { ColumnType } from "@/contracts/columns";
import { DatabaseAdapter } from "./DatabaseAdapter";
import { DatabaseDialect } from "@/contracts/database";

export class PostgreSqlAdapter extends DatabaseAdapter {
  public readonly dialect = DatabaseDialect.POSTGRESQL;

  protected readonly typeMap: Record<ColumnType, string> = {
    [ColumnType.INT]: "INTEGER",
    [ColumnType.BIGINT]: "BIGINT",
    [ColumnType.DECIMAL]: "DECIMAL(10,2)",
    [ColumnType.VARCHAR]: "VARCHAR(255)",
    [ColumnType.TEXT]: "TEXT",
    [ColumnType.DATE]: "DATE",
    [ColumnType.DATETIME]: "TIMESTAMP",
    [ColumnType.TIMESTAMP]: "TIMESTAMP",
    [ColumnType.BOOLEAN]: "BOOLEAN",
    [ColumnType.JSON]: "JSONB",
    [ColumnType.UUID]: "UUID",
  };

  protected quoteIdentifier(name: string): string {
    return `"${name}"`;
  }
}
