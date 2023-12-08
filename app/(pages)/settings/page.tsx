"use client";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const session = useSession();
  return (
    <section className="w-full text-white py-5">
      <div className="w-full">
        <p className="text-xl font-medium">Logged as:</p>
        <p className="text-primary font-bold text-center">
          {session.data?.user?.email}
        </p>
      </div>
      <p className="text-xl font-medium pb-4">
        Role: {session.data?.user.role}
      </p>
      <p className="text-xl font-medium">Your token lasts: 13 min 24 sec</p>

      <div className="py-8 flex justify-around items-center">
        <Button size="lg" className="w-40" variant="grey">
          Check it again
        </Button>
        <Button size="lg" className="w-40" onClick={() => signOut()}>
          Logout
        </Button>
      </div>
    </section>
  );
}
