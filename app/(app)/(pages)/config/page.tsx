import React from "react";

import Render from "@/components/Render";
import ConfigSkeleton from "@/components/ConfigSkeleton";

const TelemetryConfig = () => {
  return (
    <div className="w-full flex flex-col items-start gap-4 pb-20 text-white">
      <React.Suspense fallback={<ConfigSkeleton />}>
        <Render
          vehicleId="fenice-evo"
          deviceId="onboard"
          configurationId="telemetry-config"
        />
      </React.Suspense>
    </div>
  );
};

export default TelemetryConfig;
