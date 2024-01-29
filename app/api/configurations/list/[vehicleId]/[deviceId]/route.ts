import { getJWT } from "@/lib/auth"
import { RouteParams } from "./types"
import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/db"

/**
 * @swagger
 * /api/configurations/list/{vehicleId}/{deviceId}:
 *   get:
 *     summary: Retrieve the list of configurations owned by a device
 *     description: Retrieve the list of configurations owned by a device. The device must provide the vehicleId and deviceId in the URL. The device must also provide a valid JWT token in the Authorization header. The device must be registered in the database, otherwise the request will be rejected.
 *     tags: [Configurations]
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
 *         description: Ok. Configuration has been saved
 *         content:
 *           application/json:
 *             description: A list of configurationIds
 *             example: ["configuration1", "configuration2"]
 *             schema:
 *               type: array 
 *               items:
 *                 type: string
 *       401:
 *         description: Unauthorized. Probably missing or invalid JWT token
 */
export async function GET(req: NextRequest, { params }: { params: RouteParams }): Promise<NextResponse> {
  
  const token = await getJWT(req)

  if (!token) {
    return new NextResponse(null, { status: 401 })  // Unauthorized
  }

  const db = await getDatabase()
  const collection = db.collection("configurations")

  const configurations = await collection.find(
    {
      vehicleId: params.vehicleId,
      deviceId: params.deviceId,
    },
    {
      projection: {
        configurationId: 1
      }
    }
  ).toArray()

  const configurationsStringArray = configurations.map(configuration => configuration.configurationId)

  return new NextResponse(JSON.stringify(configurationsStringArray), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
