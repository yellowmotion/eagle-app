import { createContext } from "react";
import { MqttClient } from "mqtt"
import { Root } from "protobufjs";

export type DashboardContextContent = {
  client: MqttClient | null,
  primary_proto_file: string | null,
  primary_proto_root: Root | null,
  secondary_proto_file: string | null,
  secondary_proto_root: Root | null,
}

export const DashboardContext = createContext<DashboardContextContent>({
  client: null,
  primary_proto_file: null,
  primary_proto_root: null,
  secondary_proto_file: null,
  secondary_proto_root: null
})

