import { cn } from "@/lib/utils";
import type { FC } from "react";

export const ErrorLabel: FC<React.ComponentProps<"p">> = (props) => {
  const { className, children, ...rest } = props;
  
  return (
    <p className={cn("text-destructive", className)} {...rest}>
      {children}
    </p>
  );
};
