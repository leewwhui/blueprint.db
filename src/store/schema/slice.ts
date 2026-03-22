import type { IRelation, ITable } from "@/contracts/schema";
import { createSlice } from "@reduxjs/toolkit";
import {
  addRelationAction,
  addTableAction,
  deleteTableAction,
  updateTableAction,
} from "./reducer";
import { FieldType } from "@/lib/field-type";
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
          isPrimary: true,
          isNullable: false,
          isUnique: true,
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
  },
});

export const { addTable, updateTable, deleteTable, addRelation } =
  schemaSlice.actions;
