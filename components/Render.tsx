"use client";
import React, { useEffect, useCallback } from "react";

import { useForm } from "react-hook-form";
import axios from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import {
  schemaResolve,
  contentDefaultValues,
  groupKeys,
  splitKeyDisplay,
} from "@/lib/utils";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Icons } from "@/components/Icons";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

import { ConfigHandler } from "@/components/ConfigHandler";
import { DeviceContext } from "@/components/ContextDevice";
import { Button } from "@/components/ui/button";

const Render = ({ configurationId }: { configurationId: string }) => {
  const [schema, setSchema] = React.useState<any>({});
  const [content, setContent] = React.useState<any>({});
  const [lastModified, setLastModified] = React.useState<number>(
    new Date().getTime()
  );
  const { device } = React.useContext(DeviceContext);

  const form = useForm({
    defaultValues: contentDefaultValues(schema, content),
  });
  let toastId: string;

  const configContent = useQuery({
    queryKey: [configurationId, "content"],
    queryFn: async () => {
      const response = await axios.get(
        `/api/configurations/content/${device?.vehicleId}/${device?.deviceId}/${configurationId}`
      );
      return response;
    },
    enabled: !!device,
  });

  const configSchema = useQuery({
    queryKey: [configurationId, "schema"],
    queryFn: async () => {
      const response = await axios.get(
        `/api/configurations/schema/${configContent.data?.data.configurationVersionHash}/${configurationId}`
      );
      return response;
    },
    enabled: !!configContent.data && !! device,
  });

  const lastModifiedQuery = useQuery({
    queryKey: [
      "lastModified",
      device?.vehicleId,
      device?.deviceId,
      configurationId,
    ],
    refetchInterval: 5000,
    queryFn: async () => {
      const response = await axios.head(
        `/api/configurations/content/${device?.vehicleId}/${device?.deviceId}/${configurationId}`
      );
      return response;
    },
    enabled: !!configContent.data,
  });

  const mutation = useMutation({
    mutationFn: async (values: any) => {
      toastId = toast.loading("Saving configuration...");
      const response = await axios.post(
        `/api/configurations/content/${device?.vehicleId}/${device?.deviceId}/${configurationId}`,
        {
          configurationVersionHash:
            configContent.data?.data.configurationVersionHash,
          content: values,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response;
    },
    onSuccess: () => {
      toast.dismiss(toastId);
      toast.success("Configuration saved!");
      setLastModified(new Date().getTime());
    },
    onError: () => {
      toast.dismiss(toastId);
      toast.error("Error saving configuration!");
    },
  });

  const handleRefresh = useCallback(() => {
    toastId = toast.loading("Fetching...");
    configContent.refetch();
    setLastModified(new Date().getTime());
    toast.dismiss(toastId);
    toast.success("Configuration fetched!");
  }, [configContent]);

  useEffect(() => {
    if (configContent.data && configContent.isSuccess) {
      setContent(configContent.data.data.content);
      form.reset(contentDefaultValues(schema, configContent.data.data.content));
    }
    if (configSchema.data && configSchema.isSuccess) {
      setSchema(schemaResolve(configSchema.data.data, configSchema.data.data));
      setLastModified(new Date().getTime());
    }
  }, [
    configSchema.data,
    configSchema.isSuccess,
    configContent.data,
    configContent.isSuccess,
    form,
    schema,
  ]);

  useEffect(() => {
    if (lastModifiedQuery.data && lastModifiedQuery.isSuccess) {
      if (
        new Date(lastModifiedQuery.data.headers["last-modified"]).getTime() >
        lastModified
      ) {
        toast.custom(
          (t) => (
            <div
              className={`${
                t.visible ? "animate-enter" : "animate-leave"
              } bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 px-2 py-1`}
            >
              <div className="flex items-center justify-center p-2">
                <Icons.bell className="w-6 h-6  text-black" />
              </div>
              <div className="p-2 flex flex-col items-center justify-center">
                <p className="text-black">Update available</p>
              </div>
              <div className="p-2">
                <Button
                  variant="reversed"
                  onClick={() => {
                    toast.remove(t.id);
                    handleRefresh();
                  }}
                >
                  Accept
                </Button>
              </div>
            </div>
          ),
          {
            duration: 5000,
          }
        );
        setLastModified(
          new Date(lastModifiedQuery.data.headers["last-modified"]).getTime()
        );
      }
    }
  }, [
    lastModifiedQuery.data,
    lastModifiedQuery.isSuccess,
    lastModified,
    handleRefresh,
  ]);

  function onSubmit(values: any) {
    // if (form.formState.isDirty) {
      mutation.mutate(groupKeys(values, schema));
    // } else {
    //   toast("No changes made", {
    //     icon: "✏️",
    //   });
    // }
  }

  const render = (configSchema: any, configContent: any, key: string) => {
    const label = key.split("/").pop();
    switch (configSchema.type) {
      case "string":
        return (
          <FormField
            control={form.control}
            name={key}
            render={({ field }) => (
              <FormItem className="py-2">
                <FormLabel className="capitalize">
                  {(label as string).replace(/\d+$/, "")}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={configContent}
                    {...field}
                    className="text-black dark:text-white text-base"
                    defaultValue={configContent}
                  />
                </FormControl>
                {/* <FormDescription>{configContent}</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case "number":
      case "integer":
        return (
          <FormField
            control={form.control}
            name={key}
            render={({ field }) => (
              <FormItem className="flex gap-8 items-center py-2">
                <FormLabel className="text-lg capitalize min-w-max">
                  {(label as string)
                    .replace(/([a-z])([A-Z])/g, "$1 $2")
                    .replace(/\/\d+$/, "")}
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={configContent}
                    {...field}
                    className="text-black dark:text-white text-base"
                  />
                </FormControl>
                {/* <FormDescription>{configContent}</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case "boolean":
        return (
          <FormField
            control={form.control}
            name={key}
            render={({ field }) => (
              <FormItem className="flex gap-8 items-center p-2">
                <FormControl>
                  <Checkbox
                    {...field}
                    checked={
                      field.value
                      // configContent !== undefined ? configContent : false
                    }
                    onCheckedChange={(checked) => {
                      configContent = checked;
                      form.setValue(key, configContent);
                    }}
                  />
                </FormControl>
                <FormLabel className="text-lg capitalize">{label}</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "object":
        return renderObjectField(configSchema, configContent, key);
      case "array":
        return renderArrayField(configSchema, configContent, key);
      default:
        return null;
    }
  };

  const renderObjectField = (
    configSchema: any,
    configContent: any,
    key: string
  ) => {
    return (
      <div className="w-full py-4">
        <h3 className="font-medium text-xl capitalize text-primary">
          {splitKeyDisplay(key)}
        </h3>
        {Object.entries(configSchema.properties).map(([subkey, value]) => (
          <React.Fragment key={subkey}>
            {render(
              value,
              configContent[subkey],
              key.length > 0 ? `${key}/${subkey}` : subkey
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const renderArrayField = (
    configSchema: any,
    configContent: any,
    key: string
  ) => {
    return (
      <div className="w-full py-4">
        <h3 className="font-medium text-xl capitalize text-primary">
          {splitKeyDisplay(key)}
        </h3>
        {configContent.map((item: any, index: number) => (
          <div key={index} className="py-0">
            {render(
              configSchema.items,
              item,
              key.length > 0 ? `${key}/${index}` : `${index}`
            )}
          </div>
        ))}
      </div>
    );
  };

  if (!schema || !content) return null;

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full text-black dark:text-white"
        >
          {render(schema, content, "")}
        </form>
      </Form>
      <div className="fixed bottom-2 left-0 right-0 max-w-md p-2 m-auto">
        <ConfigHandler
          onSendClick={form.handleSubmit(onSubmit)}
          onRefreshClick={handleRefresh}
        />
      </div>
    </>
  );
};

export default Render;
