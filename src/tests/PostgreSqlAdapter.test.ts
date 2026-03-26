import { describe, it, expect } from "vitest";
import { ColumnConstraints, ColumnType } from "@/contracts/columns";
import { PostgreSqlAdapter } from "@/adapter/PostgreSqlAdapter";
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

describe("PostgreSqlAdapter", () => {
  const adapter = new PostgreSqlAdapter();

  describe("dialect", () => {
    it("should return 'postgresql' as dialect", () => {
      expect(adapter.dialect).toBe("postgresql");
    });
  });

  describe("getColumnType", () => {
    it("should map INT to INTEGER", () => {
      expect(adapter.getColumnType(ColumnType.INT)).toBe("INTEGER");
    });

    it("should map BIGINT to BIGINT", () => {
      expect(adapter.getColumnType(ColumnType.BIGINT)).toBe("BIGINT");
    });

    it("should map DECIMAL to DECIMAL(10,2)", () => {
      expect(adapter.getColumnType(ColumnType.DECIMAL)).toBe("DECIMAL(10,2)");
    });

    it("should map VARCHAR to VARCHAR(255)", () => {
      expect(adapter.getColumnType(ColumnType.VARCHAR)).toBe("VARCHAR(255)");
    });

    it("should map TEXT to TEXT", () => {
      expect(adapter.getColumnType(ColumnType.TEXT)).toBe("TEXT");
    });

    it("should map DATE to DATE", () => {
      expect(adapter.getColumnType(ColumnType.DATE)).toBe("DATE");
    });

    it("should map DATETIME to TIMESTAMP", () => {
      expect(adapter.getColumnType(ColumnType.DATETIME)).toBe("TIMESTAMP");
    });

    it("should map TIMESTAMP to TIMESTAMP", () => {
      expect(adapter.getColumnType(ColumnType.TIMESTAMP)).toBe("TIMESTAMP");
    });

    it("should map BOOLEAN to BOOLEAN", () => {
      expect(adapter.getColumnType(ColumnType.BOOLEAN)).toBe("BOOLEAN");
    });

    it("should map JSON to JSONB", () => {
      expect(adapter.getColumnType(ColumnType.JSON)).toBe("JSONB");
    });

    it("should map UUID to UUID", () => {
      expect(adapter.getColumnType(ColumnType.UUID)).toBe("UUID");
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
        name: "email",
        type: ColumnType.VARCHAR,
        constraints: createConstraints({ [ColumnConstraints.NOT_NULL]: true }),
      };
      expect(adapter.generateColumnSql(column)).toBe(
        '  "email" VARCHAR(255) NOT NULL',
      );
    });

    it("should generate column with UNIQUE constraint", () => {
      const column: IColumn = {
        id: "3",
        name: "username",
        type: ColumnType.VARCHAR,
        constraints: createConstraints({ [ColumnConstraints.UNIQUE]: true }),
      };
      expect(adapter.generateColumnSql(column)).toBe(
        '  "username" VARCHAR(255) UNIQUE',
      );
    });

    it("should NOT include AUTO_INCREMENT (PostgreSQL has no auto increment keyword)", () => {
      const column: IColumn = {
        id: "4",
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

    it("should generate column with multiple constraints", () => {
      const column: IColumn = {
        id: "5",
        name: "email",
        type: ColumnType.VARCHAR,
        constraints: createConstraints({
          [ColumnConstraints.NOT_NULL]: true,
          [ColumnConstraints.UNIQUE]: true,
        }),
      };
      expect(adapter.generateColumnSql(column)).toBe(
        '  "email" VARCHAR(255) NOT NULL UNIQUE',
      );
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

    it("should generate composite PRIMARY KEY", () => {
      const table: ITable = {
        id: "t2",
        name: "order_items",
        columns: [
          {
            id: "1",
            name: "order_id",
            type: ColumnType.INT,
            constraints: createConstraints({
              [ColumnConstraints.PRIMARY_KEY]: true,
            }),
          },
          {
            id: "2",
            name: "item_id",
            type: ColumnType.INT,
            constraints: createConstraints({
              [ColumnConstraints.PRIMARY_KEY]: true,
            }),
          },
        ],
      };
      expect(adapter.generatePrimaryKeySql(table)).toBe(
        '  PRIMARY KEY ("order_id", "item_id")',
      );
    });

    it("should return null when no PRIMARY KEY exists", () => {
      const table: ITable = {
        id: "t3",
        name: "logs",
        columns: [
          {
            id: "1",
            name: "message",
            type: ColumnType.TEXT,
            constraints: createConstraints(),
          },
        ],
      };
      expect(adapter.generatePrimaryKeySql(table)).toBeNull();
    });
  });

  describe("generateTableSql", () => {
    it("should generate CREATE TABLE with double-quote identifiers", () => {
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
          {
            id: "2",
            name: "name",
            type: ColumnType.VARCHAR,
            constraints: createConstraints({
              [ColumnConstraints.NOT_NULL]: true,
            }),
          },
        ],
      };
      const result = adapter.generateTableSql(table);
      expect(result).toContain('CREATE TABLE "users"');
      expect(result).toContain('"id" INTEGER');
      expect(result).toContain('"name" VARCHAR(255) NOT NULL');
      expect(result).toContain('PRIMARY KEY ("id")');
      expect(result).toContain(");");
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
        onDelete: ForeignKeyReferentialAction.NO_ACTION,
      };
      const result = adapter.generateRelationSql(relation, tables);
      expect(result).toContain('ALTER TABLE "orders"');
      expect(result).toContain('"fk_orders_user_id_users_id"');
      expect(result).toContain('FOREIGN KEY ("user_id")');
      expect(result).toContain('REFERENCES "users"("id")');
    });

    it("should include ON DELETE CASCADE", () => {
      const relation: IRelation = {
        id: "r2",
        sourceTableId: "t2",
        sourceColumnId: "c2",
        targetTableId: "t1",
        targetColumnId: "c1",
        cardinality: ForeignKeyCardinality.MANY_TO_ONE,
        onUpdate: ForeignKeyReferentialAction.NO_ACTION,
        onDelete: ForeignKeyReferentialAction.CASCADE,
      };
      const result = adapter.generateRelationSql(relation, tables);
      expect(result).toContain("ON DELETE CASCADE");
    });

    it("should include ON UPDATE SET NULL", () => {
      const relation: IRelation = {
        id: "r3",
        sourceTableId: "t2",
        sourceColumnId: "c2",
        targetTableId: "t1",
        targetColumnId: "c1",
        cardinality: ForeignKeyCardinality.MANY_TO_ONE,
        onUpdate: ForeignKeyReferentialAction.SET_NULL,
        onDelete: ForeignKeyReferentialAction.NO_ACTION,
      };
      const result = adapter.generateRelationSql(relation, tables);
      expect(result).toContain("ON UPDATE SET NULL");
    });
  });

  describe("generateSchemaSql", () => {
    it("should generate full schema with tables and relations", () => {
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
          name: "posts",
          columns: [
            {
              id: "c2",
              name: "id",
              type: ColumnType.INT,
              constraints: createConstraints({
                [ColumnConstraints.PRIMARY_KEY]: true,
              }),
            },
            {
              id: "c3",
              name: "author_id",
              type: ColumnType.INT,
              constraints: createConstraints(),
            },
          ],
        },
      ];
      const relations: IRelation[] = [
        {
          id: "r1",
          sourceTableId: "t2",
          sourceColumnId: "c3",
          targetTableId: "t1",
          targetColumnId: "c1",
          cardinality: ForeignKeyCardinality.MANY_TO_ONE,
          onUpdate: ForeignKeyReferentialAction.NO_ACTION,
          onDelete: ForeignKeyReferentialAction.CASCADE,
        },
      ];
      const result = adapter.generateSchemaSql(tables, relations);
      expect(result).toContain('CREATE TABLE "users"');
      expect(result).toContain('CREATE TABLE "posts"');
      expect(result).toContain('ALTER TABLE "posts"');
      expect(result).toContain("ON DELETE CASCADE");
    });
  });
});
