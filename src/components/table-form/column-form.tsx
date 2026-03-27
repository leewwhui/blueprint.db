import { IconSelector, IconX } from "@tabler/icons-react";
import { Button } from "../ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Input } from "../ui/input";
import { createElement, useEffect, type FC } from "react";
import { ColumnConstraints, ColumnType } from "@/contracts/columns";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import type { IColumn, TableFormValues } from "@/contracts/schema";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { CONSTRAINT_ICONS, CONSTRAINT_NAMES } from "@/lib/columns";

interface ColumnFormProps {
  column: IColumn;
  index: number;
  onColumnDelete: (index: number) => void;
}

export const ColumnForm: FC<ColumnFormProps> = (props) => {
  const { column, onColumnDelete, index } = props;
  const {
    control,
    getValues,
    register,
    setValue,
    formState: { errors },
  } = useFormContext<TableFormValues>();

  const error = errors.columns?.[index];

  const isPrimary = useWatch({
    control,
    name: `columns.${index}.constraints.${ColumnConstraints.PRIMARY_KEY}`,
  });

  useEffect(() => {
    const path = `columns.${index}.constraints` as const;

    if (isPrimary) {
      const constraints = getValues(path);
      setValue(path, {
        ...constraints,
        [ColumnConstraints.NULLABLE]: false,
      });
    }
  }, [getValues, isPrimary, setValue, index]);

  return (
    <Collapsible key={column.id}>
      <div className="flex flex-col justify-start">
        <div className="flex items-center gap-1 justify-between">
          <div className="flex gap-2 flex-1">
            <Input
              type="text"
              className="w-1/2"
              placeholder="Enter column name"
              {...register(`columns.${index}.name` as const, {
                required: "Column name is required",
              })}
            />

            <Controller
              control={control}
              name={`columns.${index}.type` as const}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => field.onChange(value)}
                  value={field.value}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {Object.values(ColumnType).map((columnType) => (
                        <SelectItem key={columnType} value={columnType}>
                          {columnType}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div>
            <Button
              size="icon"
              variant="destructive"
              onClick={() => onColumnDelete(index)}
            >
              <IconX />
            </Button>

            <CollapsibleTrigger asChild>
              <Button size="icon" variant="ghost">
                <IconSelector />
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>

        {error?.name && (
          <p className="text-destructive">{error.name.message}</p>
        )}
      </div>

      <CollapsibleContent className="flex gap-3 py-3 border-b">
        {Object.values(ColumnConstraints).map((constraint) => {
          const disable =
            isPrimary && constraint === ColumnConstraints.NULLABLE;

          return (
            <Controller
              key={constraint}
              control={control}
              name={`columns.${index}.constraints.${constraint}` as const}
              render={({ field }) => (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      disabled={disable}
                      onClick={() => field.onChange(!field.value)}
                      variant={field.value ? "default" : "outline"}
                      size="icon"
                    >
                      {createElement(CONSTRAINT_ICONS[constraint])}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{CONSTRAINT_NAMES[constraint]}</p>
                  </TooltipContent>
                </Tooltip>
              )}
            />
          );
        })}
      </CollapsibleContent>
    </Collapsible>
  );
};
