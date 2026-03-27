import { describe, it, expect } from "vitest";
import { tableFormSchema } from "@/components/table-form/table-validation";
import { ColumnConstraints, ColumnType } from "@/contracts/columns";

const createConstraints = (
  overrides: Partial<Record<ColumnConstraints, boolean>> = {},
) => ({
  [ColumnConstraints.PRIMARY_KEY]: false,
  [ColumnConstraints.NULLABLE]: false,
  [ColumnConstraints.UNIQUE]: false,
  [ColumnConstraints.AUTO_INCREMENT]: false,
  ...overrides,
});

const validTable = {
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

describe("tableFormSchema", () => {
  describe("valid input", () => {
    it("should pass with a valid table", () => {
      const result = tableFormSchema.safeParse(validTable);
      expect(result.success).toBe(true);
    });

    it("should pass with multiple columns and one PK", () => {
      const result = tableFormSchema.safeParse({
        name: "products",
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
              [ColumnConstraints.NULLABLE]: true,
            }),
          },
          {
            id: "3",
            name: "price",
            type: ColumnType.DECIMAL,
            constraints: createConstraints(),
          },
        ],
      });
      expect(result.success).toBe(true);
    });
  });

  describe("table name validation", () => {
    it("should fail when table name is empty", () => {
      const result = tableFormSchema.safeParse({
        ...validTable,
        name: "",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("columns validation", () => {
    it("should fail when columns array is empty", () => {
      const result = tableFormSchema.safeParse({
        name: "users",
        columns: [],
      });
      expect(result.success).toBe(false);
    });

    it("should fail when column name is empty", () => {
      const result = tableFormSchema.safeParse({
        name: "users",
        columns: [
          {
            id: "1",
            name: "",
            type: ColumnType.INT,
            constraints: createConstraints({
              [ColumnConstraints.PRIMARY_KEY]: true,
            }),
          },
        ],
      });
      expect(result.success).toBe(false);
    });

    it("should fail when column id is empty", () => {
      const result = tableFormSchema.safeParse({
        name: "users",
        columns: [
          {
            id: "",
            name: "id",
            type: ColumnType.INT,
            constraints: createConstraints({
              [ColumnConstraints.PRIMARY_KEY]: true,
            }),
          },
        ],
      });
      expect(result.success).toBe(false);
    });
  });

  describe("duplicate column names", () => {
    it("should fail when two columns have the same name", () => {
      const result = tableFormSchema.safeParse({
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
            name: "id",
            type: ColumnType.VARCHAR,
            constraints: createConstraints(),
          },
        ],
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const paths = result.error.issues.map((i) => i.path.join("."));
        expect(paths).toContain("columns.0.name");
        expect(paths).toContain("columns.1.name");
      }
    });

    it("should detect duplicates case-insensitively", () => {
      const result = tableFormSchema.safeParse({
        name: "users",
        columns: [
          {
            id: "1",
            name: "Email",
            type: ColumnType.VARCHAR,
            constraints: createConstraints({
              [ColumnConstraints.PRIMARY_KEY]: true,
            }),
          },
          {
            id: "2",
            name: "email",
            type: ColumnType.VARCHAR,
            constraints: createConstraints(),
          },
        ],
      });
      expect(result.success).toBe(false);
    });
  });

  describe("primary key validation", () => {
    it("should fail when no column is marked as PRIMARY KEY", () => {
      const result = tableFormSchema.safeParse({
        name: "users",
        columns: [
          {
            id: "1",
            name: "id",
            type: ColumnType.INT,
            constraints: createConstraints(),
          },
        ],
      });
      expect(result.success).toBe(false);
    });

    it("should fail when more than one column is marked as PRIMARY KEY", () => {
      const result = tableFormSchema.safeParse({
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
            name: "code",
            type: ColumnType.VARCHAR,
            constraints: createConstraints({
              [ColumnConstraints.PRIMARY_KEY]: true,
            }),
          },
        ],
      });
      expect(result.success).toBe(false);
    });
  });
});
