import type { IColumn } from "@/contracts/schema";
import { Handle, type HandleProps } from "@xyflow/react";
import type { FC } from "react";

interface ColumnHandleProps extends HandleProps {
  column: IColumn;
}

export const ColumnHandle: FC<ColumnHandleProps> = (props) => {
  const { column, ...rests } = props;

  return (
    <Handle
      {...rests}
      style={{
        position: "absolute",
        opacity: 0,
        left: 0,
        top: 0,
        transform: "none",
        width: "100%",
        height: "100%",
      }}
    />
  );
};
