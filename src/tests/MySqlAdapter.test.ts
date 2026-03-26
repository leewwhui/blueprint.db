import { describe, it, expect } from "vitest";
import { ColumnConstraints, ColumnType } from "@/contracts/columns";
import { MySqlAdapter } from "@/adapter/MySqlAdapter";
import type { ITable, IColumn, IRelation } from "@/contracts/schema";
import { ForeignKeyCardinality, ForeignKeyReferentialAction } from "@/contracts/relationship";

// Helper to create column constraints with defaults
const createConstraints = (overrides: Partial<Record<ColumnConstraints, boolean>> = {}) => ({
  [ColumnConstraints.PRIMARY_KEY]: false,
  [ColumnConstraints.NOT_NULL]: false,
  [ColumnConstraints.UNIQUE]: false,
  [ColumnConstraints.AUTO_INCREMENT]: false,
  ...overrides,
});

describe("MySqlAdapter", () => {
  const adapter = new MySqlAdapter();

  describe("dialect", () => {
    it("should return 'mysql' as dialect", () => {
      expect(adapter.dialect).toBe("mysql");
    });
  });

  describe("getColumnType", () => {
    it("should map ColumnType.INT to INT", () => {
      expect(adapter.getColumnType(ColumnType.INT)).toBe("INT");
    });

    it("should map ColumnType.BIGINT to BIGINT", () => {
      expect(adapter.getColumnType(ColumnType.BIGINT)).toBe("BIGINT");
    });

    it("should map ColumnType.DECIMAL to DECIMAL(10,2)", () => {
      expect(adapter.getColumnType(ColumnType.DECIMAL)).toBe("DECIMAL(10,2)");
    });

    it("should map ColumnType.VARCHAR to VARCHAR(255)", () => {
      expect(adapter.getColumnType(ColumnType.VARCHAR)).toBe("VARCHAR(255)");
    });

    it("should map ColumnType.TEXT to TEXT", () => {
      expect(adapter.getColumnType(ColumnType.TEXT)).toBe("TEXT");
    });

    it("should map ColumnType.DATE to DATE", () => {
      expect(adapter.getColumnType(ColumnType.DATE)).toBe("DATE");
    });

    it("should map ColumnType.DATETIME to DATETIME", () => {
      expect(adapter.getColumnType(ColumnType.DATETIME)).toBe("DATETIME");
    });

    it("should map ColumnType.TIMESTAMP to TIMESTAMP", () => {
      expect(adapter.getColumnType(ColumnType.TIMESTAMP)).toBe("TIMESTAMP");
    });

    it("should map ColumnType.BOOLEAN to BOOLEAN", () => {
      expect(adapter.getColumnType(ColumnType.BOOLEAN)).toBe("BOOLEAN");
    });

    it("should map ColumnType.JSON to JSON", () => {
      expect(adapter.getColumnType(ColumnType.JSON)).toBe("JSON");
    });

    it("should map ColumnType.UUID to CHAR(36)", () => {
      expect(adapter.getColumnType(ColumnType.UUID)).toBe("CHAR(36)");
    });
  });

  describe("generateColumnSql", () => {
    it("should generate simple column SQL with backtick quotes", () => {
      const column: IColumn = {
        id: "1",
        name: "id",
        type: ColumnType.INT,
        constraints: createConstraints({ [ColumnConstraints.PRIMARY_KEY]: true }),
      };

      const result = adapter.generateColumnSql(column);
      expect(result).toBe("  `id` INT");
    });

    it("should generate column with NOT_NULL constraint", () => {
      const column: IColumn = {
        id: "2",
        name: "email",
        type: ColumnType.VARCHAR,
        constraints: createConstraints({ [ColumnConstraints.NOT_NULL]: true }),
      };

      const result = adapter.generateColumnSql(column);
      expect(result).toBe("  `email` VARCHAR(255) NOT NULL");
    });

    it("should generate column with UNIQUE constraint", () => {
      const column: IColumn = {
        id: "3",
        name: "username",
        type: ColumnType.VARCHAR,
        constraints: createConstraints({ [ColumnConstraints.UNIQUE]: true }),
      };

      const result = adapter.generateColumnSql(column);
      expect(result).toBe("  `username` VARCHAR(255) UNIQUE");
    });

    it("should generate column with AUTO_INCREMENT constraint", () => {
      const column: IColumn = {
        id: "4",
        name: "user_id",
        type: ColumnType.INT,
        constraints: createConstraints({ [ColumnConstraints.AUTO_INCREMENT]: true }),
      };

      const result = adapter.generateColumnSql(column);
      expect(result).toBe("  `user_id` INT AUTO_INCREMENT");
    });

    it("should generate column with multiple constraints", () => {
      const column: IColumn = {
        id: "5",
        name: "id",
        type: ColumnType.INT,
        constraints: createConstraints({
          [ColumnConstraints.PRIMARY_KEY]: true,
          [ColumnConstraints.AUTO_INCREMENT]: true,
          [ColumnConstraints.NOT_NULL]: true,
        }),
      };

      const result = adapter.generateColumnSql(column);
      expect(result).toBe("  `id` INT NOT NULL AUTO_INCREMENT");
    });

    it("should handle column names with special characters", () => {
      const column: IColumn = {
        id: "6",
        name: "user-name",
        type: ColumnType.VARCHAR,
        constraints: createConstraints(),
      };

      const result = adapter.generateColumnSql(column);
      expect(result).toContain("`user-name`");
    });

    it("should handle column names with spaces", () => {
      const column: IColumn = {
        id: "7",
        name: "first name",
        type: ColumnType.VARCHAR,
        constraints: createConstraints(),
      };

      const result = adapter.generateColumnSql(column);
      expect(result).toContain("`first name`");
    });
  });

  describe("generatePrimaryKeySql", () => {
    it("should generate PRIMARY KEY for single column", () => {
      const table: ITable = {
        id: "table1",
        name: "users",
        columns: [
          {
            id: "1",
            name: "id",
            type: ColumnType.INT,
            constraints: createConstraints({ [ColumnConstraints.PRIMARY_KEY]: true }),
          },
        ],
      };

      const result = adapter.generatePrimaryKeySql(table);
      expect(result).toBe("  PRIMARY KEY (`id`)");
    });

    it("should generate PRIMARY KEY for composite key", () => {
      const table: ITable = {
        id: "table2",
        name: "order_items",
        columns: [
          {
            id: "1",
            name: "order_id",
            type: ColumnType.INT,
            constraints: createConstraints({ [ColumnConstraints.PRIMARY_KEY]: true }),
          },
          {
            id: "2",
            name: "item_id",
            type: ColumnType.INT,
            constraints: createConstraints({ [ColumnConstraints.PRIMARY_KEY]: true }),
          },
        ],
      };

      const result = adapter.generatePrimaryKeySql(table);
      expect(result).toBe("  PRIMARY KEY (`order_id`, `item_id`)");
    });

    it("should return null when no PRIMARY KEY exists", () => {
      const table: ITable = {
        id: "table3",
        name: "tags",
        columns: [
          {
            id: "1",
            name: "name",
            type: ColumnType.VARCHAR,
            constraints: createConstraints({ [ColumnConstraints.NOT_NULL]: true }),
          },
        ],
      };

      const result = adapter.generatePrimaryKeySql(table);
      expect(result).toBeNull();
    });
  });

  describe("generateTableSql", () => {
    it("should generate CREATE TABLE statement with single column", () => {
      const table: ITable = {
        id: "table1",
        name: "users",
        columns: [
          {
            id: "1",
            name: "id",
            type: ColumnType.INT,
            constraints: createConstraints({ [ColumnConstraints.PRIMARY_KEY]: true }),
          },
        ],
      };

      const result = adapter.generateTableSql(table);
      expect(result).toContain("CREATE TABLE `users`");
      expect(result).toContain("`id` INT");
      expect(result).toContain("PRIMARY KEY (`id`)");
      expect(result).toContain(");");
    });

    it("should generate CREATE TABLE with multiple columns", () => {
      const table: ITable = {
        id: "table2",
        name: "users",
        columns: [
          {
            id: "1",
            name: "id",
            type: ColumnType.INT,
            constraints: createConstraints({
              [ColumnConstraints.PRIMARY_KEY]: true,
              [ColumnConstraints.AUTO_INCREMENT]: true,
            }),
          },
          {
            id: "2",
            name: "email",
            type: ColumnType.VARCHAR,
            constraints: createConstraints({
              [ColumnConstraints.NOT_NULL]: true,
              [ColumnConstraints.UNIQUE]: true,
            }),
          },
          {
            id: "3",
            name: "status",
            type: ColumnType.VARCHAR,
            constraints: createConstraints(),
          },
        ],
      };

      const result = adapter.generateTableSql(table);
      expect(result).toContain("CREATE TABLE `users`");
      expect(result).toContain("`id` INT AUTO_INCREMENT");
      expect(result).toContain("`email` VARCHAR(255) NOT NULL UNIQUE");
      expect(result).toContain("`status` VARCHAR(255)");
      expect(result).toContain("PRIMARY KEY (`id`)");
    });

    it("should format with proper newlines and commas", () => {
      const table: ITable = {
        id: "table3",
        name: "products",
        columns: [
          {
            id: "1",
            name: "id",
            type: ColumnType.INT,
            constraints: createConstraints({ [ColumnConstraints.PRIMARY_KEY]: true }),
          },
          {
            id: "2",
            name: "name",
            type: ColumnType.VARCHAR,
            constraints: createConstraints({ [ColumnConstraints.NOT_NULL]: true }),
          },
        ],
      };

      const result = adapter.generateTableSql(table);
      const lines = result.split("\n");
      expect(lines[0]).toBe("CREATE TABLE `products` (");
      expect(lines[1]).toContain("`id`");
      expect(lines[1]).toContain(",");
      expect(lines[2]).toContain("`name`");
      expect(lines[2]).toContain(",");
      expect(lines[3]).toContain("PRIMARY KEY");
      expect(lines[4]).toBe(");");
    });
  });

  describe("generateRelationSql", () => {
    it("should generate ALTER TABLE FOREIGN KEY statement", () => {
      const tables: ITable[] = [
        {
          id: "table1",
          name: "users",
          columns: [
            {
              id: "1",
              name: "id",
              type: ColumnType.INT,
              constraints: createConstraints({ [ColumnConstraints.PRIMARY_KEY]: true }),
            },
          ],
        },
        {
          id: "table2",
          name: "orders",
          columns: [
            {
              id: "2",
              name: "user_id",
              type: ColumnType.INT,
              constraints: createConstraints(),
            },
          ],
        },
      ];

      const relation: IRelation = {
        id: "rel1",
        sourceTableId: "table2",
        sourceColumnId: "2",
        targetTableId: "table1",
        targetColumnId: "1",
        cardinality: ForeignKeyCardinality.ONE_TO_ONE,
        onUpdate: ForeignKeyReferentialAction.NO_ACTION,
        onDelete: ForeignKeyReferentialAction.NO_ACTION
      };

      const result = adapter.generateRelationSql(relation, tables);
      expect(result).toContain("ALTER TABLE `orders`");
      expect(result).toContain("ADD CONSTRAINT");
      expect(result).toContain("fk_orders_user_id_users_id");
      expect(result).toContain("FOREIGN KEY (`user_id`)");
      expect(result).toContain("REFERENCES `users`(`id`)");
    });

    it("should generate relation name with backticks", () => {
      const tables: ITable[] = [
        {
          id: "t1",
          name: "parent_table",
          columns: [
            {
              id: "c1",
              name: "id",
              type: ColumnType.INT,
              constraints: createConstraints({ [ColumnConstraints.PRIMARY_KEY]: true }),
            },
          ],
        },
        {
          id: "t2",
          name: "child_table",
          columns: [
            {
              id: "c2",
              name: "parent_id",
              type: ColumnType.INT,
              constraints: createConstraints(),
            },
          ],
        },
      ];

      const relation: IRelation = {
        id: "rel1",
        sourceTableId: "t2",
        sourceColumnId: "c2",
        targetTableId: "t1",
        targetColumnId: "c1",
        cardinality: ForeignKeyCardinality.MANY_TO_ONE,
        onUpdate: ForeignKeyReferentialAction.NO_ACTION,
        onDelete: ForeignKeyReferentialAction.NO_ACTION,
      };

      const result = adapter.generateRelationSql(relation, tables);
      expect(result).toContain("`fk_child_table_parent_id_parent_table_id`");
    });

    it("should return null when source table not found", () => {
      const tables: ITable[] = [
        {
          id: "table1",
          name: "users",
          columns: [
            {
              id: "1",
              name: "id",
              type: ColumnType.INT,
              constraints: createConstraints({ [ColumnConstraints.PRIMARY_KEY]: true }),
            },
          ],
        },
      ];

      const relation: IRelation = {
        id: "rel1",
        sourceTableId: "nonexistent",
        sourceColumnId: "2",
        targetTableId: "table1",
        targetColumnId: "1",
        cardinality: ForeignKeyCardinality.MANY_TO_ONE,
        onUpdate: ForeignKeyReferentialAction.NO_ACTION,
        onDelete: ForeignKeyReferentialAction.NO_ACTION,
      };

      const result = adapter.generateRelationSql(relation, tables);
      expect(result).toBeNull();
    });

    it("should return null when target table not found", () => {
      const tables: ITable[] = [
        {
          id: "table2",
          name: "orders",
          columns: [
            {
              id: "2",
              name: "user_id",
              type: ColumnType.INT,
              constraints: createConstraints(),
            },
          ],
        },
      ];

      const relation: IRelation = {
        id: "rel1",
        sourceTableId: "table2",
        sourceColumnId: "2",
        targetTableId: "nonexistent",
        targetColumnId: "1",
        cardinality: ForeignKeyCardinality.MANY_TO_ONE,
        onUpdate: ForeignKeyReferentialAction.NO_ACTION,
        onDelete: ForeignKeyReferentialAction.NO_ACTION,
      };

      const result = adapter.generateRelationSql(relation, tables);
      expect(result).toBeNull();
    });

    it("should return null when source column not found", () => {
      const tables: ITable[] = [
        {
          id: "table1",
          name: "users",
          columns: [
            {
              id: "1",
              name: "id",
              type: ColumnType.INT,
              constraints: createConstraints({ [ColumnConstraints.PRIMARY_KEY]: true }),
            },
          ],
        },
        {
          id: "table2",
          name: "orders",
          columns: [
            {
              id: "2",
              name: "user_id",
              type: ColumnType.INT,
              constraints: createConstraints(),
            },
          ],
        },
      ];

      const relation: IRelation = {
        id: "rel1",
        sourceTableId: "table2",
        sourceColumnId: "nonexistent",
        targetTableId: "table1",
        targetColumnId: "1",
        cardinality: ForeignKeyCardinality.MANY_TO_ONE,
        onUpdate: ForeignKeyReferentialAction.NO_ACTION,
        onDelete: ForeignKeyReferentialAction.NO_ACTION,
      };

      const result = adapter.generateRelationSql(relation, tables);
      expect(result).toBeNull();
    });

    it("should return null when target column not found", () => {
      const tables: ITable[] = [
        {
          id: "table1",
          name: "users",
          columns: [
            {
              id: "1",
              name: "id",
              type: ColumnType.INT,
              constraints: createConstraints({ [ColumnConstraints.PRIMARY_KEY]: true }),
            },
          ],
        },
        {
          id: "table2",
          name: "orders",
          columns: [
            {
              id: "2",
              name: "user_id",
              type: ColumnType.INT,
              constraints: createConstraints(),
            },
          ],
        },
      ];

      const relation: IRelation = {
        id: "rel1",
        sourceTableId: "table2",
        sourceColumnId: "2",
        targetTableId: "table1",
        targetColumnId: "nonexistent",
        cardinality: ForeignKeyCardinality.MANY_TO_ONE,
        onUpdate: ForeignKeyReferentialAction.NO_ACTION,
        onDelete: ForeignKeyReferentialAction.NO_ACTION,
      };

      const result = adapter.generateRelationSql(relation, tables);
      expect(result).toBeNull();
    });
  });

  describe("generateSchemaSql", () => {
    it("should generate complete schema with single table", () => {
      const tables: ITable[] = [
        {
          id: "table1",
          name: "users",
          columns: [
            {
              id: "1",
              name: "id",
              type: ColumnType.INT,
              constraints: createConstraints({
                [ColumnConstraints.PRIMARY_KEY]: true,
                [ColumnConstraints.AUTO_INCREMENT]: true,
              }),
            },
            {
              id: "2",
              name: "email",
              type: ColumnType.VARCHAR,
              constraints: createConstraints({ [ColumnConstraints.NOT_NULL]: true }),
            },
          ],
        },
      ];

      const result = adapter.generateSchemaSql(tables);
      expect(result).toContain("CREATE TABLE `users`");
      expect(result).toContain("`id` INT AUTO_INCREMENT");
      expect(result).toContain("`email` VARCHAR(255) NOT NULL");
      expect(result).toContain("PRIMARY KEY (`id`)");
    });

    it("should generate complete schema with multiple tables and relations", () => {
      const tables: ITable[] = [
        {
          id: "table1",
          name: "users",
          columns: [
            {
              id: "1",
              name: "id",
              type: ColumnType.INT,
              constraints: createConstraints({
                [ColumnConstraints.PRIMARY_KEY]: true,
                [ColumnConstraints.AUTO_INCREMENT]: true,
              }),
            },
          ],
        },
        {
          id: "table2",
          name: "orders",
          columns: [
            {
              id: "2",
              name: "id",
              type: ColumnType.INT,
              constraints: createConstraints({
                [ColumnConstraints.PRIMARY_KEY]: true,
                [ColumnConstraints.AUTO_INCREMENT]: true,
              }),
            },
            {
              id: "3",
              name: "user_id",
              type: ColumnType.INT,
              constraints: createConstraints(),
            },
          ],
        },
      ];

      const relations: IRelation[] = [
        {
          id: "rel1",
          sourceTableId: "table2",
          sourceColumnId: "3",
          targetTableId: "table1",
          targetColumnId: "1",
          cardinality: ForeignKeyCardinality.MANY_TO_ONE,
          onUpdate: ForeignKeyReferentialAction.NO_ACTION,
          onDelete: ForeignKeyReferentialAction.NO_ACTION,
        },
      ];

      const result = adapter.generateSchemaSql(tables, relations);
      expect(result).toContain("CREATE TABLE `users`");
      expect(result).toContain("CREATE TABLE `orders`");
      expect(result).toContain("ALTER TABLE `orders`");
      expect(result).toContain("FOREIGN KEY (`user_id`)");
      expect(result).toContain("REFERENCES `users`(`id`)");
    });

    it("should handle schema with no relations", () => {
      const tables: ITable[] = [
        {
          id: "table1",
          name: "tags",
          columns: [
            {
              id: "1",
              name: "id",
              type: ColumnType.INT,
              constraints: createConstraints({ [ColumnConstraints.PRIMARY_KEY]: true }),
            },
            {
              id: "2",
              name: "name",
              type: ColumnType.VARCHAR,
              constraints: createConstraints({ [ColumnConstraints.NOT_NULL]: true }),
            },
          ],
        },
      ];

      const result = adapter.generateSchemaSql(tables, []);
      expect(result).toContain("CREATE TABLE `tags`");
      expect(result).not.toContain("ALTER TABLE");
    });

    it("should handle schema with no tables", () => {
      const result = adapter.generateSchemaSql([]);
      expect(result).toBe("");
    });

    it("should filter out null relations", () => {
      const tables: ITable[] = [
        {
          id: "table1",
          name: "users",
          columns: [
            {
              id: "1",
              name: "id",
              type: ColumnType.INT,
              constraints: createConstraints({ [ColumnConstraints.PRIMARY_KEY]: true }),
            },
          ],
        },
      ];

      const relations: IRelation[] = [
        {
          id: "rel1",
          sourceTableId: "nonexistent",
          sourceColumnId: "2",
          targetTableId: "table1",
          targetColumnId: "1",
          cardinality: ForeignKeyCardinality.MANY_TO_ONE,
          onUpdate: ForeignKeyReferentialAction.NO_ACTION,
          onDelete: ForeignKeyReferentialAction.NO_ACTION,
        },
      ];

      const result = adapter.generateSchemaSql(tables, relations);
      expect(result).toContain("CREATE TABLE `users`");
      expect(result).not.toContain("ALTER TABLE");
    });

    it("should properly format multiple relations", () => {
      const tables: ITable[] = [
        {
          id: "table1",
          name: "users",
          columns: [
            {
              id: "1",
              name: "id",
              type: ColumnType.INT,
              constraints: createConstraints({ [ColumnConstraints.PRIMARY_KEY]: true }),
            },
          ],
        },
        {
          id: "table2",
          name: "posts",
          columns: [
            {
              id: "2",
              name: "id",
              type: ColumnType.INT,
              constraints: createConstraints({ [ColumnConstraints.PRIMARY_KEY]: true }),
            },
            {
              id: "3",
              name: "user_id",
              type: ColumnType.INT,
              constraints: createConstraints(),
            },
          ],
        },
        {
          id: "table3",
          name: "comments",
          columns: [
            {
              id: "4",
              name: "post_id",
              type: ColumnType.INT,
              constraints: createConstraints(),
            },
          ],
        },
      ];

      const relations: IRelation[] = [
        {
          id: "rel1",
          sourceTableId: "table2",
          sourceColumnId: "3",
          targetTableId: "table1",
          targetColumnId: "1",
          cardinality: ForeignKeyCardinality.MANY_TO_ONE,
          onUpdate: ForeignKeyReferentialAction.NO_ACTION,
          onDelete: ForeignKeyReferentialAction.NO_ACTION,
        },
        {
          id: "rel2",
          sourceTableId: "table3",
          sourceColumnId: "4",
          targetTableId: "table2",
          targetColumnId: "2",
          cardinality: ForeignKeyCardinality.MANY_TO_ONE,
          onUpdate: ForeignKeyReferentialAction.NO_ACTION,
          onDelete: ForeignKeyReferentialAction.NO_ACTION,
        },
      ];

      const result = adapter.generateSchemaSql(tables, relations);
      const alters = result.match(/ALTER TABLE/g);
      expect(alters?.length).toBe(2);
    });
  });

  describe("Real-world scenarios", () => {
    it("should generate E-commerce schema (users, products, orders)", () => {
      const tables: ITable[] = [
        {
          id: "users",
          name: "users",
          columns: [
            {
              id: "u1",
              name: "id",
              type: ColumnType.INT,
              constraints: createConstraints({
                [ColumnConstraints.PRIMARY_KEY]: true,
                [ColumnConstraints.AUTO_INCREMENT]: true,
              }),
            },
            {
              id: "u2",
              name: "email",
              type: ColumnType.VARCHAR,
              constraints: createConstraints({
                [ColumnConstraints.NOT_NULL]: true,
                [ColumnConstraints.UNIQUE]: true,
              }),
            },
            {
              id: "u3",
              name: "created_at",
              type: ColumnType.TIMESTAMP,
              constraints: createConstraints({ [ColumnConstraints.NOT_NULL]: true }),
            },
          ],
        },
        {
          id: "products",
          name: "products",
          columns: [
            {
              id: "p1",
              name: "id",
              type: ColumnType.INT,
              constraints: createConstraints({
                [ColumnConstraints.PRIMARY_KEY]: true,
                [ColumnConstraints.AUTO_INCREMENT]: true,
              }),
            },
            {
              id: "p2",
              name: "name",
              type: ColumnType.VARCHAR,
              constraints: createConstraints({ [ColumnConstraints.NOT_NULL]: true }),
            },
            {
              id: "p3",
              name: "price",
              type: ColumnType.DECIMAL,
              constraints: createConstraints({ [ColumnConstraints.NOT_NULL]: true }),
            },
          ],
        },
        {
          id: "orders",
          name: "orders",
          columns: [
            {
              id: "o1",
              name: "id",
              type: ColumnType.INT,
              constraints: createConstraints({
                [ColumnConstraints.PRIMARY_KEY]: true,
                [ColumnConstraints.AUTO_INCREMENT]: true,
              }),
            },
            {
              id: "o2",
              name: "user_id",
              type: ColumnType.INT,
              constraints: createConstraints({ [ColumnConstraints.NOT_NULL]: true }),
            },
            {
              id: "o3",
              name: "product_id",
              type: ColumnType.INT,
              constraints: createConstraints({ [ColumnConstraints.NOT_NULL]: true }),
            },
            {
              id: "o4",
              name: "quantity",
              type: ColumnType.INT,
              constraints: createConstraints({ [ColumnConstraints.NOT_NULL]: true }),
            },
          ],
        },
      ];

      const relations: IRelation[] = [
        {
          id: "rel1",
          sourceTableId: "orders",
          sourceColumnId: "o2",
          targetTableId: "users",
          targetColumnId: "u1",
          cardinality: ForeignKeyCardinality.MANY_TO_ONE,
          onUpdate: ForeignKeyReferentialAction.NO_ACTION,
          onDelete: ForeignKeyReferentialAction.NO_ACTION,
        },
        {
          id: "rel2",
          sourceTableId: "orders",
          sourceColumnId: "o3",
          targetTableId: "products",
          targetColumnId: "p1",
          cardinality: ForeignKeyCardinality.MANY_TO_ONE,
          onUpdate: ForeignKeyReferentialAction.NO_ACTION,
          onDelete: ForeignKeyReferentialAction.NO_ACTION,
        },
      ];

      const result = adapter.generateSchemaSql(tables, relations);
      expect(result).toContain("CREATE TABLE `users`");
      expect(result).toContain("CREATE TABLE `products`");
      expect(result).toContain("CREATE TABLE `orders`");
      expect(result).toContain("ALTER TABLE `orders`");
      expect(result.match(/ALTER TABLE/g)?.length).toBe(2);
    });

    it("should generate blog schema with tags and categories", () => {
      const tables: ITable[] = [
        {
          id: "categories",
          name: "categories",
          columns: [
            {
              id: "c1",
              name: "id",
              type: ColumnType.INT,
              constraints: createConstraints({
                [ColumnConstraints.PRIMARY_KEY]: true,
                [ColumnConstraints.AUTO_INCREMENT]: true,
              }),
            },
            {
              id: "c2",
              name: "slug",
              type: ColumnType.VARCHAR,
              constraints: createConstraints({
                [ColumnConstraints.NOT_NULL]: true,
                [ColumnConstraints.UNIQUE]: true,
              }),
            },
          ],
        },
        {
          id: "posts",
          name: "posts",
          columns: [
            {
              id: "p1",
              name: "id",
              type: ColumnType.INT,
              constraints: createConstraints({
                [ColumnConstraints.PRIMARY_KEY]: true,
                [ColumnConstraints.AUTO_INCREMENT]: true,
              }),
            },
            {
              id: "p2",
              name: "category_id",
              type: ColumnType.INT,
              constraints: createConstraints(),
            },
            {
              id: "p3",
              name: "content",
              type: ColumnType.TEXT,
              constraints: createConstraints(),
            },
            {
              id: "p4",
              name: "metadata",
              type: ColumnType.JSON,
              constraints: createConstraints(),
            },
          ],
        },
      ];

      const relations: IRelation[] = [
        {
          id: "rel1",
          sourceTableId: "posts",
          sourceColumnId: "p2",
          targetTableId: "categories",
          targetColumnId: "c1",
          cardinality: ForeignKeyCardinality.MANY_TO_ONE,
          onUpdate: ForeignKeyReferentialAction.NO_ACTION,
          onDelete: ForeignKeyReferentialAction.NO_ACTION,
        },
      ];

      const result = adapter.generateSchemaSql(tables, relations);
      expect(result).toContain("`metadata` JSON");
      expect(result).toContain("FOREIGN KEY (`category_id`)");
    });
  });
});
