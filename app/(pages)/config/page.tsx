import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import React from "react";

const TelemetryConfig = () => {
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
