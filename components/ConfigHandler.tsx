import React from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "./Icons";

function ConfigHandler() {
  return (
    <div className="flex justify-between gap-4 p-3 rounded-lg bg-stone-900">
      <Button variant="grey" className="w-32">
        <Icons.refresh className="h-4 w-4 mr-2" />
        Refresh
      </Button>
      <Button variant="default" className="w-32">
        <Icons.upload className="h-4 w-4 mr-2 stroke-2" />
        Send
      </Button>
    </div>
  );
}

export default ConfigHandler;
