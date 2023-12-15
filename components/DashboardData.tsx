"use client";
import { FC, useState, useEffect } from "react";

import { connect } from "@/lib/mqtt";
import { DashboardFields, DashboardContextContent } from "@/types/mqtt";

const DashboardData: FC<{}> = () => {
  const [fields, setFields] = useState<DashboardFields>({
    lastUpdate: null,
    speed: null,
    bestTime: null,
    lastTime: null,
    slip: null,
    torque: null,
    inverterTemp: null,
    motorTemp: null,
    lvCharge: null,
    lvTemp: null,
    hvCharge: null,
    hvTemp: null,
  });

  useEffect(() => {
    const ctx: DashboardContextContent = {
      client: null,
      primary_proto_file: null,
      primary_proto_root: null,
      secondary_proto_file: null,
      secondary_proto_root: null,
    };

    const mqttCallback = (network: string, message: { [k: string]: any }) => {
      setFields((prevFields) => {
        let newState: DashboardFields = { ...prevFields };

        Object.entries(message).forEach(([messageID, value]: [string, any]) => {
          if (messageID === "SPEED") {
            newState.speed = Math.trunc(
              (value[0].encoderR +
                value[0].encoderL) /
                2
            );
            // console.log("SPEED update " + newState.speed);
          } else if (messageID === "STEER_STATUS") {
            newState.slip = Math.trunc(value[0].mapSc);
            newState.torque = Math.trunc(value[0].mapTv);
            // console.log("STEER update " + newState.slip + " " + newState.torque);
          } else if (messageID === "LV_CELLS_VOLTAGE") {
            newState.lvCharge = Math.trunc(
              (value[0].voltage_0 + value[0].voltage_1 + value[0].voltage_2) / 3
            );
            // console.log("LV CHARGE update " + newState.lvCharge);
          } else if (messageID === "LV_CELLS_TEMP") {
            newState.lvTemp = Math.trunc(
              (value[0].temp_0 + value[0].temp_1 + value[0].temp_2) / 3
            );
            // console.log("LV TEMP update " + newState.lvTemp);
          } else if (messageID === "HV_TEMP") {
            newState.hvTemp = Math.trunc(value[0].averageTemp);
            // console.log("HV TEMP update " + newState.hvTemp);
          } else if (messageID === "HV_VOLTAGE") {
            const MAX_VOLTAGE = 400;
            if(newState.hvCharge === null) {
              newState.hvCharge = Math.trunc(value[0].packVoltage / MAX_VOLTAGE * 100);
            } else {
              newState.hvCharge = Math.trunc(newState.hvCharge*0.99 + 0.01*(value[0].packVoltage / MAX_VOLTAGE * 100));
            }
            // console.log("HV CHARGE update " + newState.hvCharge);
          }
        });

        return newState;
      });
    };

    connect(ctx, mqttCallback);

    return () => {};
  }, []);

  return (
    <section className="text-white py-5">
      <div className="bg-stone-900 w-full h-20 rounded-md p-3 font-semibold flex flex-col items-start">
        <div className="w-full flex items-center justify-start">
          <p className="text-[#F3FF14] pr-2">STATUS</p>
          <div className="w-2 h-2 rounded-full bg-green-700" />
        </div>
        <p className="text-lg pl-2">
          Delta:{" "}
          {fields.lastUpdate != null ? fields.lastUpdate.getSeconds() : "Never"}{" "}
          [s]
        </p>
      </div>

      <div className="w-full flex "></div>
      <div className="w-full flex items-end justify-center py-10 m-auto">
        <h1 className="text-6xl font-bold">{fields.speed !== null ? fields.speed : "N/A"}</h1>
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
            <h3 className="text-3xl font-medium">{fields.slip !== null ? fields.slip : "N/A"}</h3>
            <p>%</p>
          </div>
          <p className="uppercase">SLIP</p>
        </div>

        <div className="flex flex-col items-center m-auto">
          <div className="flex items-end">
            <h3 className="text-3xl font-medium">{fields.torque !== null ? fields.torque : "N/A"}</h3>
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
            <h3 className="text-3xl font-medium">{fields.lvCharge !== null ? fields.lvCharge : "N/A"}</h3>
            <p>%</p>
          </div>
          <p className="uppercase">LV</p>
        </div>

        <div className="flex flex-col items-center m-auto">
          <div className="flex items-end">
            <h3 className="text-3xl font-medium">{fields.lvTemp !== null ? fields.lvTemp : "N/A"}</h3>
            <p>°C</p>
          </div>
          <p className="uppercase">LV</p>
        </div>

        <div className="flex flex-col items-center m-auto">
          <div className="flex items-end">
            <h3 className="text-3xl font-medium">{fields.hvTemp !== null ? fields.hvTemp : "N/A"}</h3>
            <p>°C</p>
          </div>
          <p className="uppercase">HV</p>
        </div>

        <div className="flex flex-col items-center m-auto">
          <div className="flex items-end">
            <h3 className="text-3xl font-medium">{fields.hvCharge !== null ? fields.hvCharge : "N/A"}</h3>
            <p>%</p>
          </div>
          <p className="uppercase">HV</p>
        </div>
      </div>
    </section>
  );
};

export { DashboardData };
