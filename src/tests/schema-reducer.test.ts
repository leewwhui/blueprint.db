import { describe, it, expect } from "vitest";
import { ColumnConstraints, ColumnType } from "@/contracts/columns";
import {
  ForeignKeyCardinality,
  ForeignKeyReferentialAction,
} from "@/contracts/relationship";
import type { IRelation, ITable } from "@/contracts/schema";
import type { ISchemaState } from "@/store/schema/slice";
import {
  importSchemaAction,
  addTableAction,
  updateTableAction,
  deleteTableAction,
  addRelationAction,
  updateRelationAction,
  deleteReationsAction,
} from "@/store/schema/reducer";

const createConstraints = (
  overrides: Partial<Record<ColumnConstraints, boolean>> = {},
) => ({
  [ColumnConstraints.PRIMARY_KEY]: false,
  [ColumnConstraints.NOT_NULL]: false,
  [ColumnConstraints.UNIQUE]: false,
  [ColumnConstraints.AUTO_INCREMENT]: false,
  ...overrides,
});

const makeTable = (id: string, name: string): ITable => ({
  id,
  name,
  columns: [
    {
      id: `${id}_col`,
      name: "id",
      type: ColumnType.INT,
      constraints: createConstraints({ [ColumnConstraints.PRIMARY_KEY]: true }),
    },
  ],
});

const makeRelation = (id: string): IRelation => ({
  id,
  sourceTableId: "t1",
  sourceColumnId: "c1",
  targetTableId: "t2",
  targetColumnId: "c2",
  cardinality: ForeignKeyCardinality.MANY_TO_ONE,
  onUpdate: ForeignKeyReferentialAction.NO_ACTION,
  onDelete: ForeignKeyReferentialAction.NO_ACTION,
});

function createState(
  tables: ITable[] = [],
  relations: IRelation[] = [],
): ISchemaState {
  return { tables, relations };
}

// Helper to simulate PayloadAction
function action<T>(payload: T) {
  return { type: "test", payload };
}

describe("Schema Reducer", () => {
  describe("importSchemaAction", () => {
    it("should replace entire state", () => {
      const state = createState([makeTable("old", "old_table")]);
      const newTables = [makeTable("new1", "users"), makeTable("new2", "posts")];
      const newRelations = [makeRelation("r1")];

      importSchemaAction(
        state,
        action({ tables: newTables, relations: newRelations }),
      );

      expect(state.tables).toHaveLength(2);
      expect(state.tables[0].name).toBe("users");
      expect(state.relations).toHaveLength(1);
    });
  });

  describe("addTableAction", () => {
    it("should append a table to the state", () => {
      const state = createState([makeTable("t1", "users")]);
      const newTable = makeTable("t2", "orders");

      addTableAction(state, action(newTable));

      expect(state.tables).toHaveLength(2);
      expect(state.tables[1].name).toBe("orders");
    });

    it("should add to empty state", () => {
      const state = createState();
      addTableAction(state, action(makeTable("t1", "users")));
      expect(state.tables).toHaveLength(1);
    });
  });

  describe("updateTableAction", () => {
    it("should update an existing table by id", () => {
      const state = createState([makeTable("t1", "users")]);
      const updated = { ...makeTable("t1", "customers") };

      updateTableAction(state, action(updated));

      expect(state.tables).toHaveLength(1);
      expect(state.tables[0].name).toBe("customers");
    });

    it("should do nothing if table id not found", () => {
      const state = createState([makeTable("t1", "users")]);
      updateTableAction(state, action(makeTable("t999", "nope")));
      expect(state.tables).toHaveLength(1);
      expect(state.tables[0].name).toBe("users");
    });
  });

  describe("deleteTableAction", () => {
    it("should remove a table by id", () => {
      const state = createState([
        makeTable("t1", "users"),
        makeTable("t2", "orders"),
      ]);

      deleteTableAction(state, action({ tableId: "t1" }));

      expect(state.tables).toHaveLength(1);
      expect(state.tables[0].id).toBe("t2");
    });

    it("should do nothing if table id not found", () => {
      const state = createState([makeTable("t1", "users")]);
      deleteTableAction(state, action({ tableId: "t999" }));
      expect(state.tables).toHaveLength(1);
    });
  });

  describe("addRelationAction", () => {
    it("should append a relation to the state", () => {
      const state = createState([], [makeRelation("r1")]);

      addRelationAction(state, action(makeRelation("r2")));

      expect(state.relations).toHaveLength(2);
      expect(state.relations[1].id).toBe("r2");
    });
  });

  describe("updateRelationAction", () => {
    it("should update an existing relation by id", () => {
      const state = createState([], [makeRelation("r1")]);
      const updated: IRelation = {
        ...makeRelation("r1"),
        onDelete: ForeignKeyReferentialAction.CASCADE,
      };

      updateRelationAction(state, action(updated));

      expect(state.relations[0].onDelete).toBe(
        ForeignKeyReferentialAction.CASCADE,
      );
    });

    it("should do nothing if relation id not found", () => {
      const state = createState([], [makeRelation("r1")]);
      updateRelationAction(state, action(makeRelation("r999")));
      expect(state.relations).toHaveLength(1);
      expect(state.relations[0].id).toBe("r1");
    });
  });

  describe("deleteReationsAction", () => {
    it("should delete relations by ids", () => {
      const state = createState([], [
        makeRelation("r1"),
        makeRelation("r2"),
        makeRelation("r3"),
      ]);

      deleteReationsAction(state, action({ relationIds: ["r1", "r3"] }));

      expect(state.relations).toHaveLength(1);
      expect(state.relations[0].id).toBe("r2");
    });

    it("should do nothing if no ids match", () => {
      const state = createState([], [makeRelation("r1")]);
      deleteReationsAction(state, action({ relationIds: ["r999"] }));
      expect(state.relations).toHaveLength(1);
    });
  });
});
