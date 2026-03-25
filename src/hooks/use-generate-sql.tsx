import { mySqlAdapter } from "@/adapter/MySqlAdapter";
import { DatabaseDialect } from "@/contracts/database";
import { useRelations, useTables } from "@/store/schema/selector";

export const useGenerateSQL = () => {
  const dialects = {
    [DatabaseDialect.MYSQL]: mySqlAdapter,
    [DatabaseDialect.POSTGRESQL]: mySqlAdapter, // TODO: add PostgreSqlAdapter
    [DatabaseDialect.SQLITE]: mySqlAdapter, // TODO: add SqliteAdapter
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
