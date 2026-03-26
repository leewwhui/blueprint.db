import type { FC } from "react";

interface ToolbarButtonProps extends React.ComponentProps<"div"> {
  active: boolean;
}

export const ToolbarButton: FC<ToolbarButtonProps> = (props) => {
  const { children, active, ...rests } = props;
  return (
    <div
      className={`size-12 rounded hover:bg-border cursor-pointer flex flex-col items-center justify-center ${active ? "bg-border" : ""}`}
      {...rests}
    >
      {children}
    </div>
  );
};
