import { Icons } from "@/components/Icons";
import { Button, buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <main className="w-full flex min-h-screen flex-col items-center justify-between p-24 bg-black">
      <Icons.logo_vertical className="w-full" />
      <Link
        href="/dashboard"
        className={cn(
          buttonVariants({
            variant: "default",
            size: "lg",
            className: "w-56 font-semibold",
          })
        )}
      >
        Login
      </Link>
    </main>
  );
}
