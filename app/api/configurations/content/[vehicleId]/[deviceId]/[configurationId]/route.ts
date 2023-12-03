import 'reflect-metadata';
import { getDatabase } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ConfigurationMongoContent, RouteParams } from './types';

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
