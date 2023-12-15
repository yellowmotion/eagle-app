import * as React from "react";

// export const metadata: Metadata = {
//   title: "E-Agle App",
//   description: "Mobile E-Agle App",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full min-h-[100svh] bg-black">
      <div className="px-4 max-w-md m-auto ">{children}</div>
    </div>
  );
}
