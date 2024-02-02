"use client";

import * as React from "react";
import { useRouter } from 'next/navigation'
import { Check, ChevronsUpDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  /* CommandEmpty, */
  CommandGroup,
  /* CommandInput, */
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DeviceContext,
  DeviceConfigListContext,
} from "@/components/ContextDevice";

import type { Device } from "@/types/devices";

export function ComboboxDemo() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [devices, setDevices] = React.useState<Device[] | null>(null);
  const { device, setDevice } = React.useContext(DeviceContext);
  const { deviceConfigList, setDeviceConfigList } = React.useContext(
    DeviceConfigListContext
  );
  const router = useRouter();

  const devicesListQuery = useQuery({
    queryKey: ["devices"],
    queryFn: async () => {
      const response = await axios.get("/api/devices");
      return response.data;
    },
  });

  const deviceConfigListQuery = useQuery({
    queryKey: ["deviceConfig", device?.deviceId],
    queryFn: async () => {
      const response = await axios.get(
        `/api/configurations/list/${device?.vehicleId}/${device?.deviceId}`
      );
      return response.data;
    },
    enabled: !!device,
  });

  React.useEffect(() => {
    if (devicesListQuery.data && devicesListQuery.isSuccess) {
      setDevices(devicesListQuery.data);
      setValue(devicesListQuery.data[0].deviceId);
      setDevice(devicesListQuery.data[0]);
    }
  }, [devicesListQuery.data, devicesListQuery.isSuccess, setDevice]);

  React.useEffect(() => {
    if (deviceConfigListQuery.data && deviceConfigListQuery.isSuccess) {
      setDeviceConfigList(deviceConfigListQuery.data);
    }
  }, [
    deviceConfigListQuery.data,
    deviceConfigListQuery.isSuccess,
    setDeviceConfigList,
  ]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between capitalize"
        >
          {value && devices
            ? devices.find((device: Device) => device.deviceId === value)
                ?.deviceId
            : "Select device..."}

          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          {/* <CommandInput placeholder="Search device..." /> */}
          {/* <CommandEmpty>No device found.</CommandEmpty> */}
          <CommandGroup>
            {devices?.map((deviceItem: Device) => (
              <CommandItem
                key={deviceItem.deviceId}
                value={deviceItem.deviceId}
                onSelect={(currentValue) => {
                  setValue(currentValue);
                  setDevice(deviceItem);
                  router.replace("/");
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === deviceItem.deviceId ? "opacity-100" : "opacity-0"
                  )}
                />
                <span className="font-semibold capitalize">
                  {deviceItem.deviceId}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
