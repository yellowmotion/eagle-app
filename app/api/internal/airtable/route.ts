import 'reflect-metadata';
import { getDatabase } from '@/lib/db';
import { validate } from 'class-validator';
import { AirtableBodyRequest } from './types';
import { plainToInstance } from 'class-transformer';

/**
 * @swagger
 * /api/internal/airtable:
 *   post:
 *     summary: Send allowed users and roles from Airtable control panel to the database.
 *     description: Airtable control panel is used to manage users and roles. Every 10 minutes, Airtable pushes the users table on this endpoint. The endpoint will validate the request and save the data in the database. The platform must provide an authoriation bearer token in the request header.
 *     tags: [Airtable]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: Airtable request body
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roles:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                     role:
 *                       type: number
 *     responses:
 *       200:
 *         description: Ok. Successfully saved users and roles
 *       401:
 *         description: Unauthorized. Probably missing or invalid JWT token
 *       400:
 *         description: Bad Request. Request body is not valid
 *       500:
 *         description: Internal Server Error. Something went wrong on the server side
 */
export async function POST(req: Request): Promise<Response> {
    if (!req.headers.has('Authorization')) {
        return new Response(null, { status: 401 });
    }

    const [prefix, token] = req.headers.get('Authorization')!.split(' ');

    if (!prefix || !token || prefix !== 'Bearer' || token !== process.env.AIRTABLE_TOKEN) {
        return new Response(null, { status: 401 });
    }

    let body: { [key: string]: any };
    try {
        body = await req.json();
    }
    catch (e) {
        return new Response(null, {
            status: 400,
        });
    }

    const payload: AirtableBodyRequest = plainToInstance(
        AirtableBodyRequest,
        body
    );

    const errors = await validate(payload);
    if (errors.length > 0) {
        return new Response(null, {
            status: 400,
        });
    }

    // Erase collection before putting new data
    let db = await getDatabase();
    await db.collection('roles').drop();
    await db.collection('roles').insertMany(payload.roles);

    return new Response(null, {
        status: 200,
    });
}
