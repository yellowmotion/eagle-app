import 'reflect-metadata';
import { getDatabase } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ConfigurationMongoContent, RouteParams } from './types';
import { SchemaBindingMongoContent } from '@/app/api/configurations/schema/[hash]/[configurationId]/types';
import { Validator } from 'jsonschema';

export async function GET(
  _: NextRequest,
  { params }: { params: RouteParams }
): Promise<NextResponse> {
  // TODO: Implement authentication

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

export async function HEAD(
  _: NextRequest,
  { params }: { params: RouteParams }
): Promise<NextResponse> {
  // TODO: Implement authentication

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
  // TODO: Implement authentication

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
