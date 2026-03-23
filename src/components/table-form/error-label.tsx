import type { FC } from "react";
import { cn } from '../../lib/utils';

export const ErrorLabel: FC<React.ComponentProps<"p">> = (props) => {
  const { className, children, ...rest } = props;
  
  return (
    <p className={cn("text-destructive", className)} {...rest}>
      {children}
    </p>
  );
};
