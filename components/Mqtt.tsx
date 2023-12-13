'use client'
import mqtt from 'mqtt'

export default function MqttConnection () {
  console.log("connecting")
  const client = mqtt.connect("ws://api.eagletrt.it:9001")
  client.on("connect", () => {
    console.log("connected")
    client.subscribe("#", (err) => {
      if (!err) {
        client.publish("presence", "Hello mqtt");
      }
    })
  })

  client.on("message", console.log)
  return <></>
} 
