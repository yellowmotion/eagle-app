import React, { ReactNode, createContext } from "react";
import { Device } from "@/types/devices";

interface DeviceContextType {
  device: Device | null;
  setDevice: React.Dispatch<React.SetStateAction<Device | null>>;
}

const initialSetDevice = () => {};

export const DeviceContext = createContext<DeviceContextType>({
  device: null,
  setDevice: initialSetDevice,
});

interface DeviceConfigListContextType {
  deviceConfigList: string[] | null;
  setDeviceConfigList: React.Dispatch<React.SetStateAction<string[] | null>>;
}

const initialSetDeviceConfigList = () => {};

export const DeviceConfigListContext =
  createContext<DeviceConfigListContextType>({
    deviceConfigList: null,
    setDeviceConfigList: initialSetDeviceConfigList,
  });

const ContextDevice = ({ children }: { children: ReactNode }) => {
  const [device, setDevice] = React.useState<Device | null>(null);
  const [deviceConfigList, setDeviceConfigList] = React.useState<
    string[] | null
  >(null);

  return (
    <DeviceContext.Provider
      value={{
        device: device,
        setDevice,
      }}
    >
      <DeviceConfigListContext.Provider
        value={{
          deviceConfigList,
          setDeviceConfigList,
        }}
      >
        {children}
      </DeviceConfigListContext.Provider>
    </DeviceContext.Provider>
  );
};

export default ContextDevice;
