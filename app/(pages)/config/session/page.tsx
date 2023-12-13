import React from "react";

import Render from "@/components/Render";

const SessionConfig = () => {
  return (
    <div className="w-full flex flex-col items-start gap-4 pb-20 text-white">
      <React.Suspense fallback={<p>Loading...</p>}>
        <Render vehicleId="fenice-evo" deviceId="onboard" configurationId="session-config" />
      </React.Suspense>
    </div>
  );
};

export default SessionConfig;
