export type DashboardFields = {
  lastUpdate: Date | null;
  speed: number | null;
  bestTime: string | null;
  lastTime: string | null;
  slip: number | null;
  torque: number | null;
  inverterTemp: number | null;
  motorTemp: number | null;
  lvCharge: number | null;
  lvTemp: number | null;
  hvCharge: number | null;
  hvTemp: number | null;
};

export type DashboardContextContent = {
  client: MqttClient | null;
  primary_proto_file: string | null;
  secondary_proto_file: string | null;
  primary_proto_root: Root | null;
  secondary_proto_root: Root | null;
};