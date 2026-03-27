import type { IRelation, ITable } from "@/contracts/schema";
import { createSlice } from "@reduxjs/toolkit";
import {
  addRelationAction,
  addTableAction,
  deleteRelationsAction,
  deleteTableAction,
  importSchemaAction,
  updateRelationAction,
  updateTableAction,
} from "./reducer";
import { nanoid } from "nanoid";
import { ColumnConstraints, ColumnType } from "@/contracts/columns";

export interface ISchemaState {
  tables: ITable[];
  relations: IRelation[];
}

const initialState: ISchemaState = {
  tables: [
    {
      id: nanoid(),
      name: "Hello world",
      columns: [
        {
          id: nanoid(),
          name: "Id",
          type: ColumnType.INT,
          constraints: {
            [ColumnConstraints.PRIMARY_KEY]: true,
            [ColumnConstraints.NULLABLE]: false,
            [ColumnConstraints.UNIQUE]: false,
            [ColumnConstraints.AUTO_INCREMENT]: false,
          },
        },
      ],
    },
  ],
  relations: [],
};

export const schemaSlice = createSlice({
  name: "schema",
  initialState,
  reducers: {
    importSchema: importSchemaAction,
    addTable: addTableAction,
    updateTable: updateTableAction,
    deleteTable: deleteTableAction,
    addRelation: addRelationAction,
    updateRelation: updateRelationAction,
    deleteRelations: deleteRelationsAction,
  },
});

export const {
  importSchema,
  addTable,
  updateTable,
  deleteTable,
  addRelation,
  updateRelation,
  deleteRelations,
} = schemaSlice.actions;
