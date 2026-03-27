import { mySqlAdapter } from "@/adapter/MySqlAdapter";
import { PostgreSqlAdapter } from "@/adapter/PostgreSqlAdapter";
import { SqliteAdapter } from "@/adapter/SqliteAdapter";
import { DatabaseDialect } from "@/contracts/database";
import type { IRelation, ITable } from "@/contracts/schema";

const postgreSqlAdapter = new PostgreSqlAdapter();
const sqliteAdapter = new SqliteAdapter();

export const useGenerateSQL = () => {
  const dialects = {
    [DatabaseDialect.MYSQL]: mySqlAdapter,
    [DatabaseDialect.POSTGRESQL]: postgreSqlAdapter,
    [DatabaseDialect.SQLITE]: sqliteAdapter,
  };

  return (dialect: DatabaseDialect, tables: ITable[], relations: IRelation[]) => {
    const adapter = dialects[dialect];

    if (!adapter) {
      throw new Error(`Unsupported database dialect: ${dialect}`);
    }

    return adapter.generateSchemaSql(tables, relations);
  };
};
