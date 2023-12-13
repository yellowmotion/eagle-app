"use client";
import React, { useEffect } from "react";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios, { AxiosResponse } from "axios";
import { useQuery } from "@tanstack/react-query";

import { jsonToZod } from "@/lib/schema";
import { schemaResolve } from "@/lib/utils";

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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { ConfigHandler } from "@/components/ConfigHandler";

const Render = ({
  vehicleId,
  deviceId,
  configurationId,
}: {
  vehicleId: string;
  deviceId: string;
  configurationId: string;
}) => {
  const form = useForm();

  const [schema, setSchema] = React.useState<any>({});
  const [content, setContent] = React.useState<any>({});

  const configContent = useQuery({
    queryKey: [configurationId, "content"],
    queryFn: async () => {
      const response = await axios.get(
        `/api/configurations/content/${vehicleId}/${deviceId}/${configurationId}`
      );
      return response;
    },
  });

  const configSchema = useQuery({
    queryKey: [configurationId, "schema"],
    queryFn: async () => {
      const response = await axios.get(
        `/api/configurations/schema/${configContent.data?.headers["x-configurationversionhash"]}/${configurationId}`
      );
      return response;
    },
    enabled: !!configContent.data,
  });

  useEffect(() => {
    if (configSchema.data && configSchema.isSuccess) {
      setSchema(schemaResolve(configSchema.data.data, configSchema.data.data));
    }
    if (configContent.data && configContent.isSuccess) {
      setContent(configContent.data.data);
    }
  }, [
    configSchema.data,
    configSchema.isSuccess,
    configContent.data,
    configContent.isSuccess,
  ]);

  function onSubmit(values: any) {
    console.log("INVIATO");
    console.log(form.getValues());
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
                <FormLabel className="capitalize">{label}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={configContent as string}
                    {...field}
                    className="text-black text-base"
                    defaultValue={configContent}
                  />
                </FormControl>
                {/* <FormDescription>{configContent}</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case "integer":
        return (
          <FormField
            control={form.control}
            name={key}
            render={({ field }) => (
              <FormItem className="flex gap-8 items-center py-2">
                <FormLabel className="text-lg capitalize">{label}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={configContent}
                    {...field}
                    className="text-black text-base"
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
                      configContent !== undefined ? configContent : false
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
        return (
          <div>
            <p>{key}</p>
            <p>Array</p>
          </div>
        );
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
        <h3 className="font-medium text-xl">{configSchema.title}</h3>
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

  if (!schema || !content) return null;


  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          {render(schema, content, "")}
        </form>
      </Form>
      <div className="fixed bottom-2 left-0 right-0 max-w-md p-2 m-auto">
        <ConfigHandler onSendClick={form.handleSubmit(onSubmit)} onRefreshClick={configContent.refetch}/>
      </div>
    </>
  );
};

export default Render;