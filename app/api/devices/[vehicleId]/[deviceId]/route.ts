import { getJWT } from "@/lib/auth"
import { getDatabase } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"
import { RouteParams } from "./types"

/**
 * @swagger
 * /api/devices/{vehicleId}/{deviceId}:
 *   get:
 *     summary: Retrieve info about a specific device
 *     description: Retrieve info about a specific device. The device must provide the vehicleId and deviceId in the URL. The device must also provide a valid JWT token in the Authorization header. The device must be registered in the database, otherwise the request will be rejected.
 *     tags: [Devices]
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: deviceId 
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Ok. Device has been found and returned correctly
 *       401:
 *         description: Unauthorized. Probably missing or invalid JWT token
 *       404:
 *         description: Not found. Device cannot be found
 */
export async function GET(req: NextRequest, { params }: { params: RouteParams }): Promise<NextResponse> {
  
  const token = await getJWT(req)

  if (!token) {
    return new NextResponse(null, { status: 401 })  // Unauthorized
  }

  const db = await getDatabase()
  const collection = db.collection("devices")

  const device = await collection.findOne({
    vehicleId: params.vehicleId,
    deviceId: params.deviceId,
    $or: [
      { owner: token.email },
      { fixed: true }
    ]
  })

  if (!device) {
    return new NextResponse(null, { status: 404 })  // Not Found
  }

  return new NextResponse(JSON.stringify(device), {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

/**
 * @swagger
 * /api/devices/{vehicleId}/{deviceId}:
 *   delete:
 *     summary: Delete an owned specific device
 *     description: Delete an owned specific device. The device must provide the vehicleId and deviceId in the URL. The device must also provide a valid JWT token in the Authorization header. The device must be registered in the database, otherwise the request will be rejected.
 *     tags: [Devices]
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: deviceId 
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       204:
 *         description: No content. Device has been deleted successfully
 *       401:
 *         description: Unauthorized. Probably missing or invalid JWT token. Also returned if the device is not owned by the user
 *       404:
 *         description: Not found. Device cannot be found
 */
export async function DELETE(req: NextRequest, { params }: { params: RouteParams }): Promise<NextResponse> {
  
  const token = await getJWT(req)

  if (!token) {
    return new NextResponse(null, { status: 401 })  // Unauthorized
  }

  const db = await getDatabase()
  const collection = db.collection("devices")

  const device = await collection.findOne({
    vehicleId: params.vehicleId,
    deviceId: params.deviceId,
    owner: token.email,
  })

  if (!device) {
    return new NextResponse(null, { status: 404 })  // Not Found
  }

  await collection.deleteOne({
    vehicleId: params.vehicleId,
    deviceId: params.deviceId,
    owner: token.email,
  })

  return new NextResponse(null, { status: 204 })  // No Content
}
