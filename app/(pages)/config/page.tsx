"use client";
import React, { useEffect } from "react";
import axios, { AxiosResponse } from "axios";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

import { useQuery } from "@tanstack/react-query";

import { schemaResolve } from "@/lib/utils";

const TelemetryConfig = () => {
  const [schema, setSchema] = React.useState<any>({});
  const [content, setContent] = React.useState<any>({});

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

  return (
    <div className="w-full flex flex-col items-start gap-4 py-8 text-white">
      {schema.properties && (
        <div className="w-full flex flex-col gap-4">
          {Object.entries(schema.properties).map(([key, value]) => (
            <div key={key} className="w-full flex items-center">
              {(() => {
                switch ((value as any).type) {
                  case "string":
                    return (
                      <div className="w-full py-2">
                        <p className="capitalize">{key}</p>
                        <input
                          type="text"
                          className="w-full rounded-md bg-gray-800 text-white p-2"
                          placeholder={content[key] as string}
                        />
                      </div>
                    );
                  case "integer":
                    return (
                      <div className="w-full py-2">
                        {key} {content[key]}
                      </div>
                    );
                  case "boolean":
                    return (
                      <div className="w-full flex gap-4 items-center">
                        <Checkbox checked={content[key]} />
                        {key}
                      </div>
                    );
                  case "object":
                    return (
                      <div className="w-full py-2">
                        <h3 className="font-medium text-2xl">
                          {(value as any).title as string}
                        </h3>
                        {Object.entries((value as any).properties).map(
                          ([subkey, subvalue]) => (
                            <div key={subkey}>
                              {(() => (
                                <div className="flex gap-4">
                                  <p>{subkey}</p>
                                  <p>{content[key][subkey]}</p>
                                </div>
                              ))()}
                            </div>
                          )
                        )}
                      </div>
                    );
                  case "array":
                    return (
                      <div className="w-full py-2">
                        <h3>{key} (array)</h3>
                      </div>
                    );
                  default:
                    return <p>{key}</p>;
                }
              })()}
            </div>
          ))}
        </div>
      )}

      <p>{JSON.stringify(configContent.data?.data, null, 2)}</p>
    </div>
  );
};

export default TelemetryConfig;
