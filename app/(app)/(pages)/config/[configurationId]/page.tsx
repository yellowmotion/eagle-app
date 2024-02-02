import React from "react";
import { redirect } from "next/navigation";

import { getAuthSession } from "@/lib/auth";
import { ROLE } from "@/lib/role";
import Render from "@/components/Render";
import ConfigSkeleton from "@/components/ConfigSkeleton";

const Configuration = async ({
  params,
}: {
  params: { configurationId: string };
}) => {
  const session = await getAuthSession();

  if (session?.user.role && session?.user.role > ROLE.HW+5) { // TODO: cambiare questo
    redirect("/config/car");
  }

  return (
    <div className="w-full flex flex-col items-start gap-4 pb-20 text-white">
      <React.Suspense fallback={<ConfigSkeleton />}>
        <Render configurationId={params.configurationId} />
      </React.Suspense>
    </div>
  );
};

export default Configuration;
