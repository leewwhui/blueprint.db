import { Parser } from "node-sql-parser";

const parser = new Parser();

export const parseSQL = (sql: string) => {
  try {
    const ast = parser.astify(sql);
    console.log(ast);
    return ast;
  } catch (error) {
    console.error("Failed to parse SQL:", error);
    return null;
  }
};
