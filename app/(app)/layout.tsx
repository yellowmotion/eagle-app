import * as React from "react";
import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="w-full min-h-[100svh] dark:bg-black">
        <div className="px-4 max-w-md m-auto ">{children}</div>
      </div>
    </ThemeProvider>
  );
}
