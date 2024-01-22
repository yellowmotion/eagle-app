import React from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";

const ConfigSkeleton = () => {
  return (
    <div className="space-y-2 w-full py-4">
        <div className="flex gap-8 items-center py-2">
            <Checkbox />
            <Skeleton className="w-[150px] h-[18px] rounded-lg" />
        </div>
        
        <div className="py-2 flex flex-col gap-2">
            <Skeleton className="w-[100px] h-[20px] rounded-full" />
            <Skeleton className="w-full h-[35px] rounded-md" />
        </div>
        
        <div className="flex gap-8 items-center py-2">
            <Checkbox />
            <Skeleton className="w-[150px] h-[18px] rounded-lg" />
        </div>
        
        <div className="py-2 flex flex-col gap-2">
            <Skeleton className="w-[100px] h-[20px] rounded-full" />
            <Skeleton className="w-full h-[35px] rounded-md" />
        </div>

        <Skeleton className="w-[200px] h-[22px] rounded-full bg-primary" />

        <div className="py-2 flex flex-col gap-2">
            <Skeleton className="w-[100px] h-[20px] rounded-full" />
            <Skeleton className="w-full h-[35px] rounded-md" />
        </div>

        <div className="py-2 flex gap-2 items-center">
            <Skeleton className="w-[200px] h-[20px] rounded-full" />
            <Skeleton className="w-full h-[35px] rounded-md" />
        </div>

        <div className="flex gap-8 items-center py-2">
            <Checkbox />
            <Skeleton className="w-[150px] h-[18px] rounded-lg" />
        </div>
        
        <div className="py-2 flex flex-col gap-2">
            <Skeleton className="w-[100px] h-[20px] rounded-full" />
            <Skeleton className="w-full h-[35px] rounded-md" />
        </div>
        
        <Skeleton className="w-[200px] h-[22px] rounded-full bg-primary" />
        
        <div className="py-2 flex gap-2 items-center">
            <Skeleton className="w-[500px] h-[20px] rounded-full" />
            <Skeleton className="w-full h-[35px] rounded-md" />
        </div>
        <div className="py-2 flex flex-col gap-2">
            <Skeleton className="w-[100px] h-[20px] rounded-full" />
            <Skeleton className="w-full h-[35px] rounded-md" />
        </div>

        <div className="flex gap-8 items-center py-2">
            <Checkbox />
            <Skeleton className="w-[150px] h-[18px] rounded-lg" />
        </div>


        <div className="py-2 flex flex-col gap-2">
            <Skeleton className="w-[100px] h-[20px] rounded-full" />
            <Skeleton className="w-full h-[35px] rounded-md" />
        </div>

    </div>
  );
};

export default ConfigSkeleton;