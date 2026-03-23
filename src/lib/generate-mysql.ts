import type { ITable } from "@/contracts/schema";

export const generateMySQL = (tables: ITable[]) => {
  const sqlStatements: string[] = [];
  return sqlStatements.join("\n\n");
};
