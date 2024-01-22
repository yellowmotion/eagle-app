import ConfigNavbar from "@/components/ConfigNavbar";

export default function ConfigLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="pt-5">
      <ConfigNavbar />
      {children}
    </div>
  );
}
