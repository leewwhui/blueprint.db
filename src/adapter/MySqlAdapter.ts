import { ColumnType } from "@/contracts/columns";
import { DatabaseAdapter } from "./DatabaseAdapter";
import { DatabaseDialect } from "@/contracts/database";

export class MySqlAdapter extends DatabaseAdapter {
  public readonly dialect = DatabaseDialect.MYSQL;

  protected readonly typeMap: Record<ColumnType, string> = {
    [ColumnType.INT]: "INT",
    [ColumnType.BIGINT]: "BIGINT",
    [ColumnType.DECIMAL]: "DECIMAL(10,2)",
    [ColumnType.VARCHAR]: "VARCHAR(255)",
    [ColumnType.TEXT]: "TEXT",
    [ColumnType.DATE]: "DATE",
    [ColumnType.DATETIME]: "DATETIME",
    [ColumnType.TIMESTAMP]: "TIMESTAMP",
    [ColumnType.BOOLEAN]: "BOOLEAN",
    [ColumnType.JSON]: "JSON",
    [ColumnType.UUID]: "CHAR(36)",
  };

  protected override quoteIdentifier(name: string): string {
    return `\`${name}\``;
  }

  protected override getAutoIncrementKeyword(): string {
    return "AUTO_INCREMENT";
  }
}

export const mySqlAdapter = new MySqlAdapter();