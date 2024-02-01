import { redirect } from "next/navigation";
import { ROLE } from "@/lib/role";
import { getAuthSession } from "@/lib/auth";
import ConfigNavbar from "@/components/ConfigNavbar";

export default async function ConfigLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getAuthSession();

  if (session?.user.role && session?.user.role > ROLE.MT) {
    redirect("/");
  }
  return (
    <div className="pt-5">
      <ConfigNavbar />
      {children}
    </div>
  );
}
