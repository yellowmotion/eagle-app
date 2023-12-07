import React from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/Icons";
import { cn } from "@/lib/utils";

export interface ConfigHandlerProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const ConfigHandler = React.forwardRef<HTMLDivElement, ConfigHandlerProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn(
          "flex justify-between gap-4 p-3 rounded-lg bg-stone-900",
          className
        )}
        {...props}
      >
        <Button variant="grey" className="w-32 grow">
          <Icons.refresh className="h-4 w-4 mr-2" />
          Refresh
        </Button>
        <Button variant="default" className="w-32 grow">
          <Icons.upload className="h-4 w-4 mr-2 stroke-2" />
          Send
        </Button>
      </div>
    );
  }
);
ConfigHandler.displayName = "ConfigHandler";

export { ConfigHandler };
