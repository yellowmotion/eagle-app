import React from "react";

const SessionConfig = () => {
  return (
    <div className="w-full flex flex-col items-start gap-4 py-8 text-white">
      <div className="w-full flex flex-col items-start gap-4">
        <h3 className="text-lg font-semibold">Circuit</h3>
        <div className="w-full py-2 px-2 rounded-md bg-white text-stone-800 font-medium flex">
          Varano de Melegari
        </div>
      </div>
      <div className="w-full flex flex-col items-start gap-4">
        <h3 className="text-lg font-semibold">Pilot</h3>
        <div className="w-full py-2 px-2 rounded-md bg-white text-stone-800 font-medium flex">
          Mason
        </div>
      </div>
      <div className="w-full flex flex-col items-start gap-4">
        <h3 className="text-lg font-semibold">Race</h3>
        <div className="w-full py-2 px-2 rounded-md bg-white text-stone-800 font-medium flex">
          FSG 2021
        </div>
      </div>
      <div className="w-full flex flex-col items-start gap-4">
        <h3 className="text-lg font-semibold">Test</h3>
        <div className="w-full py-2 px-2 rounded-md bg-white text-stone-800 font-medium flex">
          Vadena
        </div>
      </div>
      <div className="w-full flex flex-col items-start gap-4">
        <h3 className="text-lg font-semibold">Date</h3>
        <div className="w-full py-2 px-2 rounded-md bg-white text-stone-800 font-medium flex">
          12/12/2021
        </div>
      </div>
    </div>
  );
};

export default SessionConfig;
