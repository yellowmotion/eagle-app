import 'reflect-metadata';
import { getDatabase } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ConfigurationMongoContent, RouteParams } from './types';
import { SchemaBindingMongoContent } from '@/app/api/configurations/schema/[hash]/[configurationId]/types';
import { Validator } from 'jsonschema';
import { getJWT } from '@/lib/auth';

/**
 * @swagger
 * /api/configurations/content/{vehicleId}/{deviceId}/{configurationId}:
 *   get:
 *     summary: Get configuration content
 *     description: Get configuration content
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
 *       - in: path
 *         name: configurationId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Ok. Response correctly sent the configuration content
 *         headers:
 *           Content-Type:
 *             description: Content type of the response
 *             value: application/json
 *             schema:
 *               type: string
 *           Last-Modified:
 *             description: Last modification date of the configuration
 *             schema:
 *               type: string
 *           X-VehicleId:
 *             description: The vehicle id of the configuration
 *             schema:
 *               type: string
 *           X-DeviceId:
 *             description: The device id of the configuration
 *             schema:
 *               type: string
 *           X-ConfigurationId:
 *             description: The configuration id searched
 *             schema:
 *               type: string
 *           X-ConfigurationVersionHash:
 *             description: Configuration has versioning. This is the hash of the version of the configuration
 *             schema:
 *               type: string
 *       401:
 *         description: Unauthorized. Probably missing or invalid JWT token
 *       404:
 *         description: Not found. Configuration cannot be found
 *       500:
 *         description: Internal Server Error. Something went wrong on the server side
 */
export async function GET(
  req: NextRequest,
  { params }: { params: RouteParams }
): Promise<NextResponse> {
  const token = await getJWT(req);
  if (!token) {
    return new NextResponse(null, { status: 401 });
  }

  const db = await getDatabase();
  const collection = await db.collection('configurations');

  const result = await collection.findOne({
    vehicleId: params.vehicleId,
    deviceId: params.deviceId,
    configurationId: params.configurationId,
  });

  if (!result) {
    return new NextResponse(null, { status: 404 });
  }

  const config = plainToInstance(ConfigurationMongoContent, result);
  const errors = await validate(config);
  if (errors.length > 0) {
    errors.forEach(console.error)
    return new NextResponse(null, { status: 500 });
  }

  return new NextResponse(JSON.stringify(config.content), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Last-Modified': config.lastUpdate,
      'X-VehicleId': config.vehicleId,
      'X-DeviceId': config.deviceId,
      'X-ConfigurationId': config.configurationId,
      'X-ConfigurationVersionHash': config.configurationVersionHash,
    },
  });
}

/**
 * @swagger
 * /api/configurations/content/{vehicleId}/{deviceId}/{configurationId}:
 *   head:
 *     summary: Fetch last modification date of the configuration
 *     description: HEAD request must be used for checking if the configuration has been modified since the last time it has been downloaded with GET method. If the configuration has been modified, the GET method must be used to download the new version of the configuration, if user accepts it.
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
 *       - in: path
 *         name: configurationId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Ok. Response correctly sent the configuration content
 *         headers:
 *           Last-Modified:
 *             description: Last modification date of the configuration
 *             schema:
 *               type: string
 *           X-VehicleId:
 *             description: The vehicle id of the configuration
 *             schema:
 *               type: string
 *           X-DeviceId:
 *             description: The device id of the configuration
 *             schema:
 *               type: string
 *           X-ConfigurationId:
 *             description: The configuration id searched
 *             schema:
 *               type: string
 *           X-ConfigurationVersionHash:
 *             description: Configuration has versioning. This is the hash of the version of the configuration
 *             schema:
 *               type: string
 *       401:
 *         description: Unauthorized. Probably missing or invalid JWT token
 *       404:
 *         description: Not found. Configuration cannot be found
 *       500:
 *         description: Internal Server Error. Something went wrong on the server side
 */
export async function HEAD(
  req: NextRequest,
  { params }: { params: RouteParams }
): Promise<NextResponse> {
  const token = await getJWT(req);
  if (!token) {
    return new NextResponse(null, { status: 401 });
  }

  const db = await getDatabase();
  const collection = await db.collection('configurations');

  const result = await collection.findOne({
    vehicleId: params.vehicleId,
    deviceId: params.deviceId,
    configurationId: params.configurationId,
  });

  if (!result) {
    return new NextResponse(null, { status: 404 });
  }

  const config = plainToInstance(ConfigurationMongoContent, result);
  const errors = await validate(config);
  if (errors.length > 0) {
    return new NextResponse(null, { status: 500 });
  }

  return new NextResponse(null, {
    status: 200,
    headers: {
      'Last-Modified': config.lastUpdate,
      'X-VehicleId': config.vehicleId,
      'X-DeviceId': config.deviceId,
      'X-ConfigurationId': config.configurationId,
      'X-ConfigurationVersionHash': config.configurationVersionHash,
    },
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: RouteParams }
) {
  const token = await getJWT(req);
  if (!token) {
    return new NextResponse(null, { status: 401 });
  }

  const content = await req.json();
  const versionHash = req.headers.get('X-ConfigurationVersionHash');

  if (!versionHash) {
    return new NextResponse(null, { status: 400 });
  }

  const db = await getDatabase();
  const schemaCollection = await db.collection('schemabindings');

  const result = await schemaCollection.findOne({
    configurationId: params.configurationId,
  });

  if (!result) {
    return new NextResponse(null, { status: 404 });
  }

  const binding = plainToInstance(SchemaBindingMongoContent, result);
  const errors = await validate(binding);
  if (errors.length > 0) {
    return new NextResponse(null, { status: 500 });
  }

  binding.url = binding.url.replace('{hash}', versionHash);

  const res = await fetch(binding.url, { cache: 'force-cache' });
  if (!res.ok) {
    console.error('request');
    return new NextResponse(null, { status: 500 });
  }

  const schema = await res.json();

  const validator = new Validator();
  const isValidSchema = validator.validate(content, schema);

  if (!isValidSchema) {
    return new NextResponse(null, { status: 400 });
  }

  const configurationsCollection = await db.collection('configurations');
  await configurationsCollection.replaceOne(
    {
      vehicleId: params.vehicleId,
      deviceId: params.deviceId,
      configurationId: params.configurationId,
    },
    {
      vehicleId: params.vehicleId,
      deviceId: params.deviceId,
      configurationId: params.configurationId,
      configurationVersionHash: versionHash,
      content: content,
      updatedBy: 'null@null.nil', // TODO: Change with authenticated user's email
      lastUpdate: new Date().toUTCString(),
    },
    { upsert: true }
  ); // TODO: Add insert error check

  return new NextResponse(null, { status: 200 });
}
