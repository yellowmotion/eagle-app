import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <section className="w-full text-white py-5">
      <div className="w-full">
        <p className="text-xl font-medium">Logged as:</p>
        <p className="text-primary font-bold text-center">
          pincopallino@studenti.unitn.it
        </p>
      </div>
      <p className="text-xl font-medium pb-4">Role: 2</p>
      <p className="text-xl font-medium">Your token lasts: 13 min 24 sec</p>

      <div className="py-8 flex justify-around items-center">
        <Button size="lg" className="w-40" variant="grey">
          Check it again
        </Button>
        <Button size="lg" className="w-40">
          Logout
        </Button>
      </div>
    </section>
  );
}
