import type { ITable } from "@/contracts/schema";

export const generateMySQL = (tables: ITable[]) => {
  const sqlStatements: string[] = [];

  tables.forEach((table) => {
    const columns = table.columns
      .map((col) => {
        let columnDef = `\`${col.name}\` ${col.type}`;

        if (col.isPrimary) {
          columnDef += " PRIMARY KEY";
        }

        if (col.isNullable === false) {
          columnDef += " NOT NULL";
        }

        return columnDef;
      })
      .join(",\n  ");

    const createTableSQL = `CREATE TABLE \`${table.name}\` (\n  ${columns}\n);`;
    sqlStatements.push(createTableSQL);
  });

  return sqlStatements.join("\n\n");
};
