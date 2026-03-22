import type { ITable } from "@/contracts/schema";
import { createSlice } from "@reduxjs/toolkit";
import {
  addTableAction,
  deleteTableAction,
  updateTableAction,
} from "./reducer";
import { FieldType } from "@/lib/field-type";
import { nanoid } from "nanoid";

export interface ISchemaState {
  tables: ITable[];
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
};

export const schemaSlice = createSlice({
  name: "schema",
  initialState,
  reducers: {
    addTable: addTableAction,
    updateTable: updateTableAction,
    deleteTable: deleteTableAction,
  },
});

export const { addTable, updateTable, deleteTable } = schemaSlice.actions;
