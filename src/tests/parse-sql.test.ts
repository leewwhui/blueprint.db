import { describe, it, expect } from "vitest";
import { parseSqlToSchema } from "@/lib/parse-sql";
import { ColumnConstraints, ColumnType } from "@/contracts/columns";
import {
  ForeignKeyCardinality,
  ForeignKeyReferentialAction,
} from "@/contracts/relationship";

describe("parseSqlToSchema", () => {
  describe("single table", () => {
    it("should parse a basic CREATE TABLE", () => {
      const sql = `
        CREATE TABLE users (
          id INT PRIMARY KEY AUTO_INCREMENT,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE
        );
      `;
      const { tables, relations } = parseSqlToSchema(sql);

      expect(tables).toHaveLength(1);
      expect(tables[0].name).toBe("users");
      expect(tables[0].columns).toHaveLength(3);

      const [id, name, email] = tables[0].columns;

      expect(id.name).toBe("id");
      expect(id.type).toBe(ColumnType.INT);
      expect(id.constraints[ColumnConstraints.PRIMARY_KEY]).toBe(true);
      expect(id.constraints[ColumnConstraints.AUTO_INCREMENT]).toBe(true);

      expect(name.name).toBe("name");
      expect(name.type).toBe(ColumnType.VARCHAR);
      expect(name.constraints[ColumnConstraints.NOT_NULL]).toBe(true);

      expect(email.name).toBe("email");
      expect(email.constraints[ColumnConstraints.UNIQUE]).toBe(true);

      expect(relations).toHaveLength(0);
    });

    it("should map SQL data types to ColumnType", () => {
      const sql = `
        CREATE TABLE types_test (
          id INT PRIMARY KEY,
          big_id BIGINT,
          price DECIMAL(10,2),
          content TEXT,
          created DATE,
          updated DATETIME,
          ts TIMESTAMP,
          active BOOLEAN,
          meta JSON,
          uid CHAR(36)
        );
      `;
      const { tables } = parseSqlToSchema(sql);
      const cols = tables[0].columns;

      expect(cols[0].type).toBe(ColumnType.INT);
      expect(cols[1].type).toBe(ColumnType.BIGINT);
      expect(cols[2].type).toBe(ColumnType.DECIMAL);
      expect(cols[3].type).toBe(ColumnType.TEXT);
      expect(cols[4].type).toBe(ColumnType.DATE);
      expect(cols[5].type).toBe(ColumnType.DATETIME);
      expect(cols[6].type).toBe(ColumnType.TIMESTAMP);
      expect(cols[7].type).toBe(ColumnType.BOOLEAN);
      expect(cols[8].type).toBe(ColumnType.JSON);
      expect(cols[9].type).toBe(ColumnType.VARCHAR);
    });
  });

  describe("table-level PRIMARY KEY", () => {
    it("should detect composite primary keys", () => {
      const sql = `
        CREATE TABLE order_items (
          order_id INT NOT NULL,
          item_id INT NOT NULL,
          quantity INT,
          PRIMARY KEY (order_id, item_id)
        );
      `;
      const { tables } = parseSqlToSchema(sql);
      const cols = tables[0].columns;

      expect(cols[0].constraints[ColumnConstraints.PRIMARY_KEY]).toBe(true);
      expect(cols[1].constraints[ColumnConstraints.PRIMARY_KEY]).toBe(true);
      expect(cols[2].constraints[ColumnConstraints.PRIMARY_KEY]).toBe(false);
    });
  });

  describe("foreign keys via ALTER TABLE", () => {
    it("should parse ALTER TABLE FOREIGN KEY", () => {
      const sql = `
        CREATE TABLE users (
          id INT PRIMARY KEY
        );
        CREATE TABLE orders (
          id INT PRIMARY KEY,
          user_id INT NOT NULL
        );
        ALTER TABLE orders
          ADD CONSTRAINT fk_orders_user_id
          FOREIGN KEY (user_id) REFERENCES users(id);
      `;
      const { tables, relations } = parseSqlToSchema(sql);

      expect(tables).toHaveLength(2);
      expect(relations).toHaveLength(1);

      const rel = relations[0];
      const ordersTable = tables.find((t) => t.name === "orders")!;
      const usersTable = tables.find((t) => t.name === "users")!;

      expect(rel.sourceTableId).toBe(ordersTable.id);
      expect(rel.targetTableId).toBe(usersTable.id);
      expect(rel.sourceColumnId).toBe(
        ordersTable.columns.find((c) => c.name === "user_id")!.id,
      );
      expect(rel.targetColumnId).toBe(
        usersTable.columns.find((c) => c.name === "id")!.id,
      );
      expect(rel.cardinality).toBe(ForeignKeyCardinality.MANY_TO_ONE);
    });

    it("should parse ON DELETE CASCADE and ON UPDATE SET NULL", () => {
      const sql = `
        CREATE TABLE parent (id INT PRIMARY KEY);
        CREATE TABLE child (
          id INT PRIMARY KEY,
          parent_id INT
        );
        ALTER TABLE child
          ADD CONSTRAINT fk_child_parent
          FOREIGN KEY (parent_id) REFERENCES parent(id)
          ON DELETE CASCADE ON UPDATE SET NULL;
      `;
      const { relations } = parseSqlToSchema(sql);

      expect(relations).toHaveLength(1);
      expect(relations[0].onDelete).toBe(ForeignKeyReferentialAction.CASCADE);
      expect(relations[0].onUpdate).toBe(ForeignKeyReferentialAction.SET_NULL);
    });
  });

  describe("multiple tables and relations", () => {
    it("should parse a multi-table schema", () => {
      const sql = `
        CREATE TABLE users (
          id INT PRIMARY KEY AUTO_INCREMENT,
          email VARCHAR(255) NOT NULL UNIQUE
        );
        CREATE TABLE posts (
          id INT PRIMARY KEY AUTO_INCREMENT,
          author_id INT NOT NULL,
          title VARCHAR(255) NOT NULL
        );
        CREATE TABLE comments (
          id INT PRIMARY KEY,
          post_id INT NOT NULL,
          user_id INT NOT NULL,
          body TEXT
        );
        ALTER TABLE posts
          ADD CONSTRAINT fk_posts_author
          FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE;
        ALTER TABLE comments
          ADD CONSTRAINT fk_comments_post
          FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE;
        ALTER TABLE comments
          ADD CONSTRAINT fk_comments_user
          FOREIGN KEY (user_id) REFERENCES users(id);
      `;
      const { tables, relations } = parseSqlToSchema(sql);

      expect(tables).toHaveLength(3);
      expect(relations).toHaveLength(3);
      expect(tables.map((t) => t.name).sort()).toEqual([
        "comments",
        "posts",
        "users",
      ]);
    });
  });

  describe("error handling", () => {
    it("should throw on invalid SQL", () => {
      expect(() => parseSqlToSchema("NOT VALID SQL")).toThrow();
    });

    it("should return empty arrays for empty input", () => {
      const result = parseSqlToSchema("");
      expect(result.tables).toHaveLength(0);
      expect(result.relations).toHaveLength(0);
    });
  });

  describe("edge cases", () => {
    it("should skip FK when target table not found in schema", () => {
      const sql = `
        CREATE TABLE orders (
          id INT PRIMARY KEY,
          user_id INT
        );
        ALTER TABLE orders
          ADD CONSTRAINT fk_orders_user
          FOREIGN KEY (user_id) REFERENCES users(id);
      `;
      const { relations } = parseSqlToSchema(sql);
      expect(relations).toHaveLength(0);
    });

    it("should skip FK when source column not found", () => {
      const sql = `
        CREATE TABLE users (id INT PRIMARY KEY);
        CREATE TABLE orders (id INT PRIMARY KEY);
        ALTER TABLE orders
          ADD CONSTRAINT fk_orders_user
          FOREIGN KEY (nonexistent_col) REFERENCES users(id);
      `;
      const { relations } = parseSqlToSchema(sql);
      expect(relations).toHaveLength(0);
    });

    it("should generate unique IDs for each table and column", () => {
      const sql = `
        CREATE TABLE a (id INT PRIMARY KEY);
        CREATE TABLE b (id INT PRIMARY KEY);
      `;
      const { tables } = parseSqlToSchema(sql);
      expect(tables[0].id).not.toBe(tables[1].id);
      expect(tables[0].columns[0].id).not.toBe(tables[1].columns[0].id);
    });
  });
});
