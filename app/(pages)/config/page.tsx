"use client";
import React from "react";
import axios, { AxiosResponse } from "axios";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

import { useQuery } from "@tanstack/react-query";

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
      <div className="w-full flex items-center gap-4">
        <Checkbox />
        <p>Camera Enable</p>
      </div>
      <div className="w-full flex items-center gap-4">
        <Checkbox />
        <p>Generate CSV</p>
      </div>
      <div className="w-full flex justify-between items-center gap-4">
        <Button variant="grey" className="grow">
          Add CAN device
        </Button>
        <Button variant="grey" className="grow">
          Add GPS device
        </Button>
      </div>
      <h3 className="text-2xl font-bold">Connection</h3>
      <div className="flex items-center gap-4">
        <Checkbox />
        <p>Enabled</p>
      </div>
      <div className="w-full flex items-center gap-4">
        <Checkbox />
        <p>Skip same can payload</p>
      </div>
      <div className="w-full flex flex-col items-start gap-3">
        <p>Downsample mps</p>
        <Slider defaultValue={[100]} max={200} step={1} />
      </div>
      <div className="w-full flex flex-col items-start gap-3">
        <p>Send rate [ms]</p>
        <Slider defaultValue={[500]} max={2000} step={1} />
      </div>
      <div className="flex items-center gap-4">
        <Checkbox />
        <p>Send sensor Data</p>
      </div>
    </div>
  );
};

export default TelemetryConfig;
