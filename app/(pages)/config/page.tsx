"use client";
import React from "react";
import axios, { AxiosResponse } from "axios";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

import { useQuery } from "@tanstack/react-query";

import { getObjectByRef } from "@/lib/utils";

const TelemetryConfig = () => {
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

  return (
    <div className="w-full flex flex-col items-start gap-4 py-8 text-white">
      {configSchema.data?.data.$ref && (
        <div>
          {Object.entries(
            getObjectByRef(
              configSchema.data?.data,
              configSchema.data?.data.$ref
            ).properties
          ).map(([key, value]) => (
            <div key={key} className="w-full flex items-center gap-4">
              {(value as any).type === "boolean" ? (
                <>
                  <p>{key}</p>
                  <Checkbox />
                </>
              ) : (
                <p>{key}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TelemetryConfig;
