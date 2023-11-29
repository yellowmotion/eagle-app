"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Icons } from "../Icons";

const devices = [
  {
    value: "onboard",
    label: "ONBOARD",
    connection: "good",
    icon: <Icons.onboard className="h-8 w-8" />,
  },
  {
    value: "handcart",
    label: "HANDCART",
    connection: "fail",
    icon: <Icons.handcart className="h-6 w-6" />,
  },
];

export function ComboboxDemo() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value ? (
            <span className="flex gap-2 items-center font-semibold">
              {devices.find((framework) => framework.value === value)?.icon}

              {devices.find((framework) => framework.value === value)?.label}
              {devices.find((framework) => framework.value === value)
                ?.connection === "good" ? (
                <div className="bg-green-600 rounded-full w-2 h-2"></div>
              ) : (
                <div className="bg-red-600 rounded-full w-2 h-2"></div>
                // <Icons.X className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              )}
            </span>
          ) : (
            "Select device..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search device..." />
          <CommandEmpty>No device found.</CommandEmpty>
          <CommandGroup>
            {devices.map((device) => (
              <CommandItem
                key={device.value}
                value={device.value}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === device.value ? "opacity-100" : "opacity-0"
                  )}
                />
                <span className="font-semibold">{device.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
