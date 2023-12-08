"use client";
import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import * as z from "zod";

import { jsonToZod } from "@/lib/schema";

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

import { Checkbox } from "@/components/ui/checkbox";

const Render = ({ schema, content }: { schema: any; content: any }) => {
  const form = useForm({
    defaultValues: content,
  });


  function onSubmit(values: any) {
    console.log("INVIATO");
    console.log(form.getValues());
  }

  const render = (configSchema: any, configContent: any, key: string = "") => {
    switch (configSchema.type) {
      case "string":
        return (
          <FormField
            control={form.control}
            name={key}
            render={({ field }) => (
              <FormItem className="py-2">
                <FormLabel>{key}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={configContent as string}
                    {...field}
                    className="text-black"
                    defaultValue={configContent}
                  />
                </FormControl>
                <FormDescription>
                {configContent}
                </FormDescription>
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
              <FormItem className="flex gap-8 items-center p-2">
                <FormLabel className="text-lg capitalize">{key}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    // placeholder={configContent as number}
                    {...field}
                    className="text-black"
                    defaultValue={configContent}
                  />
                </FormControl>
                <FormDescription>
                  {configContent}
                </FormDescription>
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
                <FormLabel className="text-lg capitalize">{key}</FormLabel>
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
                {/* <FormDescription>
                  This is your public display name.
                </FormDescription> */}
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

  return (
    <Form {...form}>
      <p>RENDER</p>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        {render(schema, content)}
        <input type="submit" />
        <DevTool control={form.control} />
      </form>
    </Form>
  );
};

export default Render;
