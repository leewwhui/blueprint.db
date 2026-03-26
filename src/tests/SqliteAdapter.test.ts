import { describe, it, expect } from "vitest";
import { ColumnConstraints, ColumnType } from "@/contracts/columns";
import { SqliteAdapter } from "@/adapter/SqliteAdapter";
import type { ITable, IColumn, IRelation } from "@/contracts/schema";
import {
  ForeignKeyCardinality,
  ForeignKeyReferentialAction,
} from "@/contracts/relationship";

const createConstraints = (
  overrides: Partial<Record<ColumnConstraints, boolean>> = {},
) => ({
  [ColumnConstraints.PRIMARY_KEY]: false,
  [ColumnConstraints.NOT_NULL]: false,
  [ColumnConstraints.UNIQUE]: false,
  [ColumnConstraints.AUTO_INCREMENT]: false,
  ...overrides,
});

describe("SqliteAdapter", () => {
  const adapter = new SqliteAdapter();

  describe("dialect", () => {
    it("should return 'sqlite' as dialect", () => {
      expect(adapter.dialect).toBe("sqlite");
    });
  });

  describe("getColumnType", () => {
    it("should map INT to INTEGER", () => {
      expect(adapter.getColumnType(ColumnType.INT)).toBe("INTEGER");
    });

    it("should map BIGINT to INTEGER", () => {
      expect(adapter.getColumnType(ColumnType.BIGINT)).toBe("INTEGER");
    });

    it("should map DECIMAL to REAL", () => {
      expect(adapter.getColumnType(ColumnType.DECIMAL)).toBe("REAL");
    });

    it("should map VARCHAR to TEXT", () => {
      expect(adapter.getColumnType(ColumnType.VARCHAR)).toBe("TEXT");
    });

    it("should map TEXT to TEXT", () => {
      expect(adapter.getColumnType(ColumnType.TEXT)).toBe("TEXT");
    });

    it("should map DATE to TEXT", () => {
      expect(adapter.getColumnType(ColumnType.DATE)).toBe("TEXT");
    });

    it("should map DATETIME to TEXT", () => {
      expect(adapter.getColumnType(ColumnType.DATETIME)).toBe("TEXT");
    });

    it("should map TIMESTAMP to TEXT", () => {
      expect(adapter.getColumnType(ColumnType.TIMESTAMP)).toBe("TEXT");
    });

    it("should map BOOLEAN to INTEGER", () => {
      expect(adapter.getColumnType(ColumnType.BOOLEAN)).toBe("INTEGER");
    });

    it("should map JSON to TEXT", () => {
      expect(adapter.getColumnType(ColumnType.JSON)).toBe("TEXT");
    });

    it("should map UUID to TEXT", () => {
      expect(adapter.getColumnType(ColumnType.UUID)).toBe("TEXT");
    });
  });

  describe("generateColumnSql", () => {
    it("should generate column with double-quote identifiers", () => {
      const column: IColumn = {
        id: "1",
        name: "id",
        type: ColumnType.INT,
        constraints: createConstraints(),
      };
      expect(adapter.generateColumnSql(column)).toBe('  "id" INTEGER');
    });

    it("should generate column with NOT_NULL constraint", () => {
      const column: IColumn = {
        id: "2",
        name: "name",
        type: ColumnType.VARCHAR,
        constraints: createConstraints({ [ColumnConstraints.NOT_NULL]: true }),
      };
      expect(adapter.generateColumnSql(column)).toBe(
        '  "name" TEXT NOT NULL',
      );
    });

    it("should NOT include AUTO_INCREMENT (SQLite has no auto increment keyword)", () => {
      const column: IColumn = {
        id: "3",
        name: "id",
        type: ColumnType.INT,
        constraints: createConstraints({
          [ColumnConstraints.AUTO_INCREMENT]: true,
        }),
      };
      const result = adapter.generateColumnSql(column);
      expect(result).toBe('  "id" INTEGER');
      expect(result).not.toContain("AUTO_INCREMENT");
    });
  });

  describe("generatePrimaryKeySql", () => {
    it("should generate PRIMARY KEY with double-quote identifiers", () => {
      const table: ITable = {
        id: "t1",
        name: "users",
        columns: [
          {
            id: "1",
            name: "id",
            type: ColumnType.INT,
            constraints: createConstraints({
              [ColumnConstraints.PRIMARY_KEY]: true,
            }),
          },
        ],
      };
      expect(adapter.generatePrimaryKeySql(table)).toBe(
        '  PRIMARY KEY ("id")',
      );
    });
  });

  describe("generateTableSql", () => {
    it("should generate CREATE TABLE with SQLite types", () => {
      const table: ITable = {
        id: "t1",
        name: "events",
        columns: [
          {
            id: "1",
            name: "id",
            type: ColumnType.INT,
            constraints: createConstraints({
              [ColumnConstraints.PRIMARY_KEY]: true,
            }),
          },
          {
            id: "2",
            name: "payload",
            type: ColumnType.JSON,
            constraints: createConstraints(),
          },
          {
            id: "3",
            name: "created_at",
            type: ColumnType.TIMESTAMP,
            constraints: createConstraints({
              [ColumnConstraints.NOT_NULL]: true,
            }),
          },
        ],
      };
      const result = adapter.generateTableSql(table);
      expect(result).toContain('CREATE TABLE "events"');
      expect(result).toContain('"id" INTEGER');
      expect(result).toContain('"payload" TEXT');
      expect(result).toContain('"created_at" TEXT NOT NULL');
      expect(result).toContain('PRIMARY KEY ("id")');
    });
  });

  describe("generateRelationSql", () => {
    const tables: ITable[] = [
      {
        id: "t1",
        name: "users",
        columns: [
          {
            id: "c1",
            name: "id",
            type: ColumnType.INT,
            constraints: createConstraints({
              [ColumnConstraints.PRIMARY_KEY]: true,
            }),
          },
        ],
      },
      {
        id: "t2",
        name: "orders",
        columns: [
          {
            id: "c2",
            name: "user_id",
            type: ColumnType.INT,
            constraints: createConstraints(),
          },
        ],
      },
    ];

    it("should generate ALTER TABLE with double-quote identifiers", () => {
      const relation: IRelation = {
        id: "r1",
        sourceTableId: "t2",
        sourceColumnId: "c2",
        targetTableId: "t1",
        targetColumnId: "c1",
        cardinality: ForeignKeyCardinality.MANY_TO_ONE,
        onUpdate: ForeignKeyReferentialAction.NO_ACTION,
        onDelete: ForeignKeyReferentialAction.CASCADE,
      };
      const result = adapter.generateRelationSql(relation, tables);
      expect(result).toContain('ALTER TABLE "orders"');
      expect(result).toContain('FOREIGN KEY ("user_id")');
      expect(result).toContain('REFERENCES "users"("id")');
      expect(result).toContain("ON DELETE CASCADE");
    });
  });

  describe("generateSchemaSql", () => {
    it("should generate full schema with SQLite types", () => {
      const tables: ITable[] = [
        {
          id: "t1",
          name: "users",
          columns: [
            {
              id: "c1",
              name: "id",
              type: ColumnType.INT,
              constraints: createConstraints({
                [ColumnConstraints.PRIMARY_KEY]: true,
              }),
            },
            {
              id: "c2",
              name: "is_active",
              type: ColumnType.BOOLEAN,
              constraints: createConstraints(),
            },
          ],
        },
      ];
      const result = adapter.generateSchemaSql(tables);
      expect(result).toContain('CREATE TABLE "users"');
      expect(result).toContain('"is_active" INTEGER');
    });

    it("should handle empty tables", () => {
      expect(adapter.generateSchemaSql([])).toBe("");
    });
  });
});
