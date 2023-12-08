"use client";
import React, { useEffect } from "react";
import axios, { AxiosResponse } from "axios";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import Render from "@/components/Render";

import { useQuery } from "@tanstack/react-query";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { DevTool } from "@hookform/devtools";

import { schemaResolve } from "@/lib/utils";
import { jsonToZod } from "@/lib/schema";

import * as z from "zod";

const TelemetryConfig = () => {
  const [schema, setSchema] = React.useState<any>({});
  const [content, setContent] = React.useState<any>({});

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<any>();
  const onSubmit: SubmitHandler<any> = (data) => console.log(data);

  const configContent = useQuery({
    queryKey: ["telemetry-config", "content"],
    queryFn: async () => {
      const response = await axios.get(
        `/api/configurations/content/fenice-evo/onboard/telemetry-config`
      );
      return response;
    },
  });

  const configSchema = useQuery({
    queryKey: ["telemetry-config", "schema"],
    queryFn: async () => {
      const response = await axios.get(
        `/api/configurations/schema/${configContent.data?.headers["x-configurationversionhash"]}/telemetry-config`
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

  const render = (configSchema: any, configContent: any, key: string = "") => {
    const label = key.split("/").pop();
    switch (configSchema.type) {
      case "string":
        return (
          <div className="w-full py-2 flex flex-col items-start gap-2">
            <p className="capitalize">{label}</p>
            <input
              type="text"
              className="w-full rounded-md bg-gray-800 text-white p-2"
              placeholder={configContent as string}
              {...register(key)}
              defaultValue={configContent}
            />
          </div>
        );
      case "integer":
        return (
          <div className="w-full py-2">
            {label} {configContent}
          </div>
        );
      case "boolean":
        return (
          <div className="w-full flex gap-4 items-center">
            <Controller
              name={key}
              control={control}
              render={({ field }) => (
                <Checkbox
                  {...field}
                  checked={configContent !== undefined ? configContent : false}
                  onCheckedChange={(checked) => {
                    configContent = checked;
                    setValue(key, configContent);
                  }}
                />
              )}
            />
            {label}
          </div>
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
    key: string = ""
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
    <div className="w-full flex flex-col items-start gap-4 py-8 pb-20 text-white">
      {schema.properties && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-4"
        >
          {render(schema, content)}
          <input type="submit" />
          <DevTool control={control} />
        </form>
      )}
      {/* <React.Suspense fallback={<p>Loading...</p>}>
        <Render schema={schema} content={content} />
      </React.Suspense> */}
    </div>
  );
};

export default TelemetryConfig;
