import { getDatabase } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { RouteParams, SchemaBindingMongoContent } from './types';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export async function GET(
  req: NextRequest,
  { params }: { params: RouteParams }
): Promise<NextResponse> {
  // TODO: Implement authentication

  console.log(params.configurationId);
  const db = await getDatabase();
  const collection = await db.collection('schemabindings');

  const result = await collection.findOne({
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

  binding.url = binding.url.replace('{hash}', params.hash);

  const res = await fetch(binding.url, { cache: 'force-cache' });
  if (!res.ok) {
    return new NextResponse(null, { status: 500 });
  }

  const schema = await res.text();

  return new NextResponse(schema, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
