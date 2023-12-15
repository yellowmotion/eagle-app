import { Icons } from "@/components/Icons";
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
