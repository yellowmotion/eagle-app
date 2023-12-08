import React from "react";

import Render from "@/components/Render";

const CarConfig = () => {
  return (
    <div className="w-full flex flex-col items-start gap-4 py-8 text-white">
      <React.Suspense fallback={<p>Loading...</p>}>
        <Render vehicleId="fenice-evo" deviceId="onboard" configurationId="car-config" />
      </React.Suspense>
    </div>
  );
};

export default CarConfig;
