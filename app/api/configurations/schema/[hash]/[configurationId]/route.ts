import { getDatabase } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { RouteParams, SchemaBindingMongoContent } from './types';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { getJWT } from '@/lib/auth';

/**
 * @swagger
 * /api/configurations/schema/{hash}/{configurationId}:
 *   get:
 *     summary: Retrieve the specific version of a configuration schema
 *     description: While receiving a configuration by calling the getter, schema must be provided as well. This endpoint will return the schema for the specific configuration. The schema is retrieved from the schema binding, which is stored in the database. The schema binding contains the URL to the schema, which is stored in the schema registry. The schema registry will return the schema for the specific configuration.
 *     tags: [Configurations]
 *     parameters:
 *       - in: path
 *         name: hash
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
 *         description: Ok. Configuration has been saved
 *       401:
 *         description: Unauthorized. Probably missing or invalid JWT token
 *       404:
 *         description: Not found. Schema cannot be found
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
