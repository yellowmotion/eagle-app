import { redirect } from "next/navigation";

import { UserAccountNav } from "@/components/UserAccountNav";
import { ComboboxDemo } from "@/components/ui/combobox";

import { getAuthSession } from "@/lib/auth";

export default async function PagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getAuthSession();

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-[svh] pt-5">
      <div className="w-full flex justify-between">
        <ComboboxDemo />
        <UserAccountNav user={session?.user} />
      </div>
      {children}
    </div>
  );
}
