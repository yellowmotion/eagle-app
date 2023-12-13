import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/sign-in");
  }
  return (
    <section className="text-white py-5">
      <div className="bg-stone-900 w-full h-20 rounded-md p-3 font-semibold flex flex-col items-start">
        <div className="w-full flex items-center justify-start">
          <p className="text-[#F3FF14] pr-2">STATUS</p>
          <div className="w-2 h-2 rounded-full bg-green-700" />
        </div>
        <p className="text-lg pl-2">Delta: 1.2 [s]</p>
      </div>

      <div className="w-full flex "></div>
      <div className="w-full flex items-end justify-center py-10 m-auto">
        <h1 className="text-6xl font-bold">80.0</h1>
        <p className="text-lg">km/h</p>
      </div>

      <div className="w-full py-8 flex justify-between">
        <div className="w-1/2 flex flex-col items-start">
          <h2 className="text-4xl font-bold">1:24.18</h2>
          <p className="uppercase">BEST TIME</p>
        </div>
        <div className="w-1/2 flex flex-col items-end">
          <h2 className="text-4xl font-bold text-right">1:25.07</h2>
          <p className="text-right uppercase">LAST TIME</p>
        </div>
      </div>

      <div className="w-full grid grid-cols-4 gap-4">
        <div className="flex flex-col items-center m-auto">
          <div className="flex items-end">
            <h3 className="text-3xl font-medium">3</h3>
            <p>%</p>
          </div>
          <p className="uppercase">SLIP</p>
        </div>

        <div className="flex flex-col items-center m-auto">
          <div className="flex items-end">
            <h3 className="text-3xl font-medium">30</h3>
          </div>
          <p className="uppercase">TRQ</p>
        </div>

        <div className="flex flex-col items-center m-auto text-orange-600">
          <div className="flex items-end">
            <h3 className="text-3xl font-medium">60</h3>
            <p>°C</p>
          </div>
          <p className="uppercase">INVERTER</p>
        </div>

        <div className="flex flex-col items-center m-auto">
          <div className="flex items-end">
            <h3 className="text-3xl font-medium">55</h3>
            <p>°C</p>
          </div>
          <p className="uppercase">MOTOR</p>
        </div>

        <div className="flex flex-col items-center m-auto">
          <div className="flex items-end">
            <h3 className="text-3xl font-medium">87</h3>
            <p>%</p>
          </div>
          <p className="uppercase">LV</p>
        </div>

        <div className="flex flex-col items-center m-auto">
          <div className="flex items-end">
            <h3 className="text-3xl font-medium">3</h3>
            <p>°C</p>
          </div>
          <p className="uppercase">LV</p>
        </div>

        <div className="flex flex-col items-center m-auto">
          <div className="flex items-end">
            <h3 className="text-3xl font-medium">3</h3>
            <p>°C</p>
          </div>
          <p className="uppercase">HV</p>
        </div>

        <div className="flex flex-col items-center m-auto">
          <div className="flex items-end">
            <h3 className="text-3xl font-medium">37</h3>
            <p>%</p>
          </div>
          <p className="uppercase">HV</p>
        </div>
      </div>
    </section>
  );
}
