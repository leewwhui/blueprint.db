import type { IRelation, ITable } from "@/contracts/schema";
import { createSlice } from "@reduxjs/toolkit";
import {
  addRelationAction,
  addTableAction,
  deleteReationsAction,
  deleteRelationAction,
  deleteTableAction,
  updateTableAction,
} from "./reducer";
import { ColumnConstraints, FieldType } from "@/lib/field-type";
import { nanoid } from "nanoid";

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
          type: FieldType.INT,
          constraints: {
            [ColumnConstraints.PRIMARY_KEY]: true,
            [ColumnConstraints.NOT_NULL]: false,
            [ColumnConstraints.UNIQUE]: false,
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
    addTable: addTableAction,
    updateTable: updateTableAction,
    deleteTable: deleteTableAction,
    addRelation: addRelationAction,
    deleteRelation: deleteRelationAction,
    deleteRelations: deleteReationsAction,
  },
});

export const {
  addTable,
  updateTable,
  deleteTable,
  addRelation,
  deleteRelation,
  deleteRelations,
} = schemaSlice.actions;
