"use client";
import React from "react";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";

import { cn } from "@/lib/utils";

function ConfigNavbar() {
  const pathname = usePathname();
  const params = useParams();
  const tabs = [
    { label: "Telemetry", path: "/config" },
    { label: "Session", path: "/config/session" },
    { label: "Car", path: "/config/car" },
  ];

  return (
    <nav className="bg-[#44403C] p-2 rounded-md flex justify-between gap-2">
      {tabs.map((tab) => (
        <Link
          key={tab.path}
          href={tab.path}
          className={cn(
            buttonVariants({
              variant: `${pathname === tab.path ? "reversed" : "secondary"}`,
              size: "default",
              className: "text-base font-bold w-28 grow"
            })
          )}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}

export default ConfigNavbar;
