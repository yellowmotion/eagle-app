"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import {
  DeviceContext,
  DeviceConfigListContext,
} from "@/components/ContextDevice";
import { Separator } from "@/components/ui/separator";
import { Icons } from "@/components/Icons";

import type { Device } from "@/types/devices";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const formSchema = z.object({
  vehicleId: z.string().min(2).max(50),
  deviceId: z.string().min(2).max(50),
});

export function ComboboxDemo() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [openAlert, setOpenAlert] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [devices, setDevices] = React.useState<Device[] | null>(null);
  const { device, setDevice } = React.useContext(DeviceContext);
  const { deviceConfigList, setDeviceConfigList } = React.useContext(
    DeviceConfigListContext
  );
  let toastId: string;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicleId: "",
      deviceId: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addDeviceMutation.mutate(values);
    setOpenAlert(!openAlert);
    form.reset();
    devicesListQuery.refetch();
    setDevices(devicesListQuery.data);
  }

  const devicesListQuery = useQuery({
    queryKey: ["devices"],
    queryFn: async () => {
      const response = await axios.get("/api/devices");
      return response.data;
    },
  });

  const deviceConfigListQuery = useQuery({
    queryKey: ["deviceConfig", device?.vehicleId, device?.deviceId],
    queryFn: async () => {
      const response = await axios.get(
        `/api/configurations/list/${device?.vehicleId}/${device?.deviceId}`
      );
      return response.data;
    },
    enabled: !!device,
  });

  const deleteDeviceMutation = useMutation({
    mutationKey: ["deleteDevice"],
    mutationFn: async (deleteDevice: Device) => {
      toastId = toast.loading("Deleting device...");
      const response = await axios.delete(
        `/api/devices/${deleteDevice.vehicleId}/${deleteDevice.deviceId}`
      );
      return response.data;
    },
    onSuccess: () => {
      toast.dismiss(toastId);
      toast.success("Device deleted successfully.");
      setOpen(false);
    },
    onError: () => {
      toast.dismiss(toastId);
      toast.error("Failed to delete device.");
    },
  });

  const addDeviceMutation = useMutation({
    mutationKey: ["addDevice"],
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      toastId = toast.loading("Adding device...");
      const response = await axios.put(`/api/devices`, values);
      return response.data;
    },
    onSuccess: () => {
      toast.dismiss(toastId);
      toast.success("Device added successfully.");
    },
    onError: () => {
      toast.dismiss(toastId);
      toast.error("Failed to add device.");
    },
  });

  React.useEffect(() => {
    if (devicesListQuery.data && devicesListQuery.isSuccess) {
      devicesListQuery.data.sort((a: Device, b: Device) =>
        a.fixed === b.fixed ? 0 : a.fixed ? -1 : 1
      );
      setDevices(devicesListQuery.data);
      setValue(
        `${devicesListQuery.data[0].vehicleId}/${devicesListQuery.data[0].deviceId}/${devicesListQuery.data[0].owner}`
      );
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
            ? devices.find(
                (device: Device) =>
                  `${device.vehicleId}/${device.deviceId}/${device.owner}` ===
                  value
              )?.deviceId
            : "Select device..."}

          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <AlertDialog open={openAlert}>
            <AlertDialogTrigger
              asChild
              onClick={() => {
                setOpenAlert(!openAlert);
              }}
            >
              <Button
                variant="ghost"
                className="m-1 px-1"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <span className="flex items-center gap-2">
                  <Icons.plus className="h-4 w-4" />
                  Aggiungi dispositivo
                </span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Add device information</AlertDialogTitle>
                <AlertDialogDescription>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-2"
                    >
                      <FormField
                        control={form.control}
                        name="vehicleId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Vehicle ID</FormLabel>
                            <FormControl>
                              <Input placeholder="vehicleId" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="deviceId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Device ID</FormLabel>
                            <FormControl>
                              <Input placeholder="deviceId" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <AlertDialogFooter className="pt-4">
                        <AlertDialogCancel
                          onClick={() => {
                            setOpenAlert(!openAlert);
                          }}
                        >
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction type="submit">
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </form>
                  </Form>
                </AlertDialogDescription>
              </AlertDialogHeader>
            </AlertDialogContent>
          </AlertDialog>

          <Separator />

          <CommandGroup>
            {devices?.map(
              (deviceItem: Device, index: number, array: Device[]) => (
                <>
                  <CommandItem
                    key={deviceItem.deviceId}
                    value={`${deviceItem.vehicleId}/${deviceItem.deviceId}/${deviceItem.owner}`}
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
                        value ===
                          `${deviceItem.vehicleId}/${deviceItem.deviceId}/${deviceItem.owner}`
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    <div className="w-full flex justify-between items-center">
                      <div className="flex flex-col items-start">
                        <span className="font-semibold capitalize">
                          {deviceItem.deviceId}
                        </span>
                        <span className="text-xs capitalize text-gray-700 dark:text-white/60">
                          {deviceItem.vehicleId}
                        </span>
                      </div>
                      {!deviceItem.fixed && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              className="w-8 h-8 p-1"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <Icons.trash className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete this device.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                onClick={() => {
                                  deleteDeviceMutation.mutate(deviceItem);
                                  devicesListQuery.refetch();
                                }}
                              >
                                Continue
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </CommandItem>
                  {index <= array.length - 2 &&
                    deviceItem.fixed &&
                    !array[index + 1].fixed && <Separator />}
                </>
              )
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
