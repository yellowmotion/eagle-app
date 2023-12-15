"use client";
import React, { FC, ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";


const ReactQueryDevtoolsProduction = React.lazy(() =>
  import("@tanstack/react-query-devtools/build/modern/production.js").then(
    (d) => ({
      default: d.ReactQueryDevtools,
    })
  )
);

interface LayoutProps {
  children: ReactNode;
}

const queryClient = new QueryClient();

const Providers: FC<LayoutProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        {children}
      </SessionProvider>
      <React.Suspense fallback={null}>
        {/* <ReactQueryDevtoolsProduction /> */}
      </React.Suspense>
    </QueryClientProvider>
  );
};

export default Providers;
