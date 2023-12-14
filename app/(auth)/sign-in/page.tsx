import { Icons } from "@/components/Icons";
import { Button, buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { redirect } from 'next/navigation';

import { cn } from "@/lib/utils";
import { getAuthSession } from "@/lib/auth";

import UserAuthForm from "@/components/UserAuthForm";

export default async function SignIn() {
  // const session = await getAuthSession();

  // if (session) {
  //   redirect("/");
  // }

  return (
    <main className="w-full flex min-h-screen flex-col items-center justify-between p-24 bg-black">
      <Icons.logo_vertical className="w-full" />
      <UserAuthForm />
    </main>
  );
}
