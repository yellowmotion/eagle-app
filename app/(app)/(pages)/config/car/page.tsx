import React from "react";
import { redirect } from "next/navigation";

import { ROLE } from "@/lib/role";
import { getAuthSession } from "@/lib/auth";
import Render from "@/components/Render";
import ConfigSkeleton from "@/components/ConfigSkeleton";

const CarConfig = async () => {
  const session = await getAuthSession();

  if (session?.user.role && session?.user.role == ROLE.HW) {
    redirect("/");
  }
  return (
    <div className="w-full flex flex-col items-start gap-4 pb-20 text-white">
      <React.Suspense fallback={<ConfigSkeleton />}>
        <Render
          vehicleId="fenice-evo"
          deviceId="onboard"
          configurationId="car-config"
        />
      </React.Suspense>
    </div>
  );
};

export default CarConfig;
