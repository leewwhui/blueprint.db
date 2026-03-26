import { mySqlAdapter } from "@/adapter/MySqlAdapter";
import { PostgreSqlAdapter } from "@/adapter/PostgreSqlAdapter";
import { SqliteAdapter } from "@/adapter/SqliteAdapter";
import { DatabaseDialect } from "@/contracts/database";
import { useRelations, useTables } from "@/store/schema/selector";

const postgreSqlAdapter = new PostgreSqlAdapter();
const sqliteAdapter = new SqliteAdapter();

export const useGenerateSQL = () => {
  const dialects = {
    [DatabaseDialect.MYSQL]: mySqlAdapter,
    [DatabaseDialect.POSTGRESQL]: postgreSqlAdapter,
    [DatabaseDialect.SQLITE]: sqliteAdapter,
  };

  const tables = useTables();
  const relations = useRelations();

  return (dialect: DatabaseDialect) => {
    const adapter = dialects[dialect];

    if (!adapter) {
      throw new Error(`Unsupported database dialect: ${dialect}`);
    }

    return adapter.generateSchemaSql(tables, relations);
  };
};
