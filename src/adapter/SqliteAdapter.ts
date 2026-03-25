import { ColumnType } from "@/contracts/columns";
import { DatabaseAdapter } from "./DatabaseAdapter";
import { DatabaseDialect } from "@/contracts/database";

export class SqliteAdapter extends DatabaseAdapter {
  public readonly dialect = DatabaseDialect.SQLITE;

  protected readonly typeMap: Record<ColumnType, string> = {
    [ColumnType.INT]: "INTEGER",
    [ColumnType.BIGINT]: "INTEGER",
    [ColumnType.DECIMAL]: "REAL",
    [ColumnType.VARCHAR]: "TEXT",
    [ColumnType.TEXT]: "TEXT",
    [ColumnType.DATE]: "TEXT",
    [ColumnType.DATETIME]: "TEXT",
    [ColumnType.TIMESTAMP]: "TEXT",
    [ColumnType.BOOLEAN]: "INTEGER",
    [ColumnType.JSON]: "TEXT",
    [ColumnType.UUID]: "TEXT",
  };

  protected quoteIdentifier(name: string): string {
    return `"${name}"`;
  }
}
