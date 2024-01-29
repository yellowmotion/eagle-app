import { getJWT } from "@/lib/auth";
import { plainToInstance } from "class-transformer";
import { NextRequest, NextResponse } from "next/server";
import { DeviceApiPostContent, DeviceMondoContent } from "./types";
import { validate } from "class-validator";
import { getDatabase } from "@/lib/db";

/**
 * @swagger
 * /api/devices:
 *   put:
 *     summary: Create a personal new custom device
 *     description: Create a new device for a vehicle. The device will be owned by the user that creates it, and will be editable only by the owner. 
 *     tags: [Devices]
 *     requestBody:
 *       description: Body must contain a valid configuration, that will be validated against the schema. Must be a valid JSON object.
 *       required: true
 *       content:
 *         application/json:
 *           description: A valid JSON object
 *           schema:
 *             type: object
 *             properties:
 *               vehicleId:
 *                 type: string
 *                 description: The vehicle id to which the device is associated
 *               deviceId:
 *                 type: string
 *                 description: The unique device id 
 *             additionalProperties: false
 *           example: { "vehicleId": "vehicle", "deviceId": "device" }
 *     responses:
 *       201:
 *         description: Created. The device has been created correctly
 *       401:
 *         description: Unauthorized. Probably missing or invalid JWT token
 *       400:
 *         description: Bad Request. The request body is not valid 
 *       409:
 *         description: Conflict. Device exists and is owned by the user or is fixed
 *       500:
 *         description: Internal Server Error. Something went wrong on the server side
 */
export async function PUT(req: NextRequest): Promise<NextResponse> {
  
  const token = await getJWT(req)

  if (!token) {
    return new NextResponse(null, { status: 401 })  // Unauthorized
  }

  let binding: DeviceApiPostContent
  try {
    const body = await req.json()
    binding = plainToInstance(DeviceApiPostContent, body) 
    const errors = await validate(binding)

    if (errors.length > 0) {
      throw new Error('Validation failed')
    }
  } catch (e) {
    return new NextResponse(null, { status: 400 })  // Bad Request
  }


  const db = await getDatabase()
  const collection = db.collection("devices")

  const existingDevice = await collection.findOne({
    vehicleId: binding.vehicleId,
    deviceId: binding.deviceId,
    $or: [
      { owner: token.email },
      { fixed: true }
    ]
  })

  if (existingDevice) {
    return new NextResponse(null, { status: 409 })  // Conflict
  }

  const device: DeviceMondoContent = {
    vehicleId: binding.vehicleId,
    deviceId: binding.deviceId,
    lastUpdate: new Date().toUTCString(),
    owner: token.email!,
    fixed: false
  }

  try {
    await collection.insertOne(device)
    return new NextResponse(null, { status: 201 })  // Created
  }
  catch (e) {
    return new NextResponse(null, { status: 500 })
  }
}

/**
 * @swagger
 * /api/devices:
 *   get:
 *     summary: Get all devices of user
 *     description: Get all devices of user. Devices are returned in order of fixed status, with fixed devices first.
 *     tags: [Devices]
 *     responses:
 *       200:
 *         description: Ok. Devices are returned correctly
 *       401:
 *         description: Unauthorized. Probably missing or invalid JWT token
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  
  const token = await getJWT(req)

  if (!token) {
    return new NextResponse(null, { status: 401 })  // Unauthorized
  }

  const db = await getDatabase()
  const collection = db.collection("devices")

  const devices = await collection.find({
    $or: [
      { owner: token.email },
      { fixed: true }
    ]
  })
    .sort({ fixed: -1 }) 
    .toArray()

  return new NextResponse(JSON.stringify(devices), {
    headers: {
      "content-type": "application/json",
    },
  })
}
