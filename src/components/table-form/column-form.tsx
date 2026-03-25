import {
  IconKey,
  IconNumber1Small,
  IconQuestionMark,
  IconSelector,
  IconX,
} from "@tabler/icons-react";
import { Button } from "../ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Input } from "../ui/input";
import { useEffect, type FC } from "react";
import { ColumnConstraints, FieldType } from "@/lib/field-type";
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
import { ErrorLabel } from "./error-label";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

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

  const constraintNames = {
    [ColumnConstraints.PRIMARY_KEY]: "Primary Key",
    [ColumnConstraints.NOT_NULL]: "Not Null",
    [ColumnConstraints.UNIQUE]: "Unique",
  };

  const constraintIcons = {
    [ColumnConstraints.PRIMARY_KEY]: <IconKey />,
    [ColumnConstraints.NOT_NULL]: <IconQuestionMark />,
    [ColumnConstraints.UNIQUE]: <IconNumber1Small />,
  };

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
        [ColumnConstraints.NOT_NULL]: false,
      });
    }
  }, [getValues, isPrimary, setValue, index]);

  return (
    <Collapsible key={column.id}>
      <div className="flex flex-col justify-start">
        <div className="flex items-center gap-1">
          <Input
            type="text"
            placeholder="Enter column name"
            {...register(`columns.${index}.name` as const, {
              required: "Column name is required",
            })}
          />
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

        {error?.name && <ErrorLabel>{error.name.message}</ErrorLabel>}
      </div>

      <CollapsibleContent className="flex flex-col gap-3 p-3 border-b">
        <div className="flex flex-row items-center gap-3">
          <span>Type</span>

          <Controller
            control={control}
            name={`columns.${index}.type` as const}
            render={({ field }) => (
              <Select
                onValueChange={(value) => field.onChange(value)}
                value={field.value}
              >
                <SelectTrigger className="flex-1" size="sm">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {Object.values(FieldType).map((fieldType) => (
                      <SelectItem key={fieldType} value={fieldType}>
                        {fieldType}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="flex gap-3 items-center">
          {Object.values(ColumnConstraints).map((constraint) => {
            const disable =
              isPrimary && constraint === ColumnConstraints.NOT_NULL;

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
                        {constraintIcons[constraint]}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{constraintNames[constraint]}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              />
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
