import { Root, parse } from "protobufjs";
import mqtt, { MqttClient } from "mqtt";

import { DashboardFields, DashboardContextContent } from "@/types/mqtt";

// TODO: Change fixed data with user selected data
const VEHICLE_ID = "fenice-evo";
const DEVICE_ID = "onboard";
const PRIMARY_TOPIC = `${VEHICLE_ID}/${DEVICE_ID}/data/primary`;
const SECONDARY_TOPIC = `${VEHICLE_ID}/${DEVICE_ID}/data/secondary`;
const PRIMARY_PROTO_URL =
  "https://raw.githubusercontent.com/eagletrt/can/78bfdba12f0547c6fc7ae670536123f9e9a0f3ba/proto/primary/primary.proto";
const SECONDARY_PROTO_URL =
  "https://raw.githubusercontent.com/eagletrt/can/78bfdba12f0547c6fc7ae670536123f9e9a0f3ba/proto/secondary/secondary.proto";

export async function fetchProtos(): Promise<{ [key: string]: string }> {
  const protos = {
    primary: PRIMARY_PROTO_URL,
    secondary: SECONDARY_PROTO_URL,
  };

  const responses = await Promise.all(
    Object.entries(protos).map(async ([key, url]) => {
      const response = await fetch(url);
      const text = await response.text();
      return [key, text];
    })
  );

  return Object.fromEntries(responses);
}

export function rootFromProtoFile(protoContent: string): Root {
  return parse(protoContent).root;
}

export function parseMessage(
  payload: Uint8Array,
  network: string,
  descriptor: Root
): { [k: string]: any } {
  return descriptor.lookupType(`${network}.Pack`).decode(payload).toJSON();
}

export async function connect(
  ctx: DashboardContextContent,
  callback: (network: string, message: { [k: string]: any }) => void
) {
  const protoFiles = await fetchProtos();
  ctx.primary_proto_file = protoFiles["primary"];
  ctx.secondary_proto_file = protoFiles["secondary"];
  ctx.primary_proto_root = rootFromProtoFile(ctx.primary_proto_file);
  ctx.secondary_proto_root = rootFromProtoFile(ctx.secondary_proto_file);
  ctx.client = mqtt.connect("wss://app.eagletrt.it/mqtt");

  ctx.client?.on("connect", () => {
    console.log("connected");
    ctx.client?.subscribe([PRIMARY_TOPIC, SECONDARY_TOPIC], (err: any) => {
      if (err) {
        throw err;
      }
    });
  });

  ctx.client?.on("message", (topic: any, payload: any) =>
    handleMqttMessage(ctx, callback, topic, payload)
  );
}

export function handleMqttMessage(
  ctx: DashboardContextContent,
  callback: (network: string, message: { [k: string]: any }) => void,
  topic: string,
  rawPayload: Uint8Array
) {
  // let decodedPayload: { [k: string]: any } | null = null;
  if (topic == PRIMARY_TOPIC) {
    callback(
      "primary",
      parseMessage(rawPayload, "primary", ctx.primary_proto_root!)
    );
  } else if (topic == SECONDARY_TOPIC) {
    callback(
      "secondary",
      parseMessage(rawPayload, "secondary", ctx.secondary_proto_root!)
    );
  }
}
