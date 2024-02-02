"use client";
import React from "react";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

import { DeviceConfigListContext } from "@/components/ContextDevice";
import { cn } from "@/lib/utils";

function ConfigNavbar() {
  const pathname = usePathname();
  const params = useParams();
  const { deviceConfigList } = React.useContext(DeviceConfigListContext);

  return (
    <nav className="bg-[#44403C] min-h-[3.5rem] p-2 rounded-md flex flex-row-reverse justify-between gap-2">
      {deviceConfigList?.map((config) => (
        <Link
          key={config}
          href={config}
          className={cn(
            buttonVariants({
              variant: `${pathname === `/config/${config}` ? "reversed" : "secondary"}`,
              size: "default",
              className: "text-base font-bold w-28 grow capitalize"
            })
          )}
        >
          {config.endsWith("-config") ? config.slice(0, -7) : config}
        </Link>
      ))}
    </nav>
  );
}

export default ConfigNavbar;
