'use client';

import protobuf from 'protobufjs'

export default function Protobuf() {
  let primary: protobuf.Root;
  let secondary: protobuf.Root;
  fetchProtos()
    .then((p) => {
      primary = protobuf.parse(p['primary']).root
      secondary = protobuf.parse(p['secondary']).root
    })
  return <div>Prova</div>;
}

async function fetchProtos(): Promise<{ [key: string]: string }> {
  const protos = {
    'primary': 'https://raw.githubusercontent.com/eagletrt/can/build-evo/proto/primary/primary.proto',
    'secondary': 'https://raw.githubusercontent.com/eagletrt/can/build-evo/proto/secondary/secondary.proto'
  }

  const responses = await Promise.all(
    Object.entries(protos).map(async ([key, url]) => {
      const response = await fetch(url);
      const text = await response.text();
      return [key, text];
    })
  );

  return Object.fromEntries(responses);
}



