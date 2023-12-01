import 'reflect-metadata';
import { getDatabase } from '@/lib/db';
import { validate } from 'class-validator';
import { AirtableBodyRequest } from './types';
import { plainToInstance } from 'class-transformer';

export async function POST(req: Request) {
    if (!req.headers.has('Authorization')) {
        return new Response(null, { status: 401 });
    }

    const [prefix, token] = req.headers.get('Authorization')!.split(' ');
    if (prefix != 'Bearer' && token != process.env.AIRTABLE_TOKEN) {
        return new Response(null, { status: 401 });
    }

    const payload: AirtableBodyRequest = plainToInstance(
        AirtableBodyRequest,
        await req.json()
    );

    const errors = await validate(payload);
    if (errors.length > 0) {
        return new Response(null, {
            status: 400,
        });
    }

    // Erase collection before putting new data
    let db = await getDatabase();
    db.collection('roles').drop();
    db.collection('roles').insertMany(payload.roles);

    return new Response(null, {
        status: 200,
    });
}
