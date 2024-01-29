import { describe, test, expect, beforeAll, afterAll } from '@jest/globals'
import { GET } from './route'
import { NextRequest } from 'next/server'
import { getDatabase } from '@/lib/db'
import { getToken } from 'next-auth/jwt'
import { faker } from '@faker-js/faker'

describe('GET /api/devices/:vehicleId/:deviceId', () => {

  beforeAll(async () => {
    console.log('Starting Devices GET tests')
  })

  afterAll(async () => {
    console.log('Finishing Devices GET tests')
  })

  test('Authorization header missing', async () => {
    
    const req = new Request('http://domain/api/devices/:vehicleId/:deviceId', {
      method: 'GET',
    })

    const res = await GET(req as NextRequest, { params: {
      vehicleId: 'vehicle',
      deviceId: 'device'
    }})

    expect(res.status).toBe(401)  // Unauthorized
  })

  test('Authorization header token wrong', async () => {

    const req = new Request('http://domain/api/devices/:vehicleId/:deviceId', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer surelywrongtoken'
      },
    })

    const res = await GET(req as NextRequest, { params: {
      vehicleId: 'vehicle',
      deviceId: 'device'
    }})

    expect(res.status).toBe(401)  // Unauthorized
  })

  test('Authorization header prefix wrong', async () => {

    const req = new Request('http://domain/api/devices/:vehicleId/:deviceId', {
      method: 'GET',
      headers: {
        'Authorization': `Beer ${process.env.TESTING_VALID_TOKEN}`
      },
    })

    const res = await GET(req as NextRequest, { params: {
      vehicleId: 'vehicle',
      deviceId: 'device'
    }})

    expect(res.status).toBe(401)  // Unauthorized
  })

  test('Request missing device', async () => {

    const req = new Request('http://domain/api/devices/:vehicleId/:deviceId', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.TESTING_VALID_TOKEN}`
      }
    })

    const res = await GET(req as NextRequest, { params: {
      vehicleId: 'vehicle',
      deviceId: faker.string.alphanumeric(20)
    }})

    expect(res.status).toBe(404)  // Not found
  })
  
  test('Correct request', async () => {
    
    const req = new Request('http://domain/api/devices/:vehicleId/:deviceId', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.TESTING_VALID_TOKEN}`
      }
    })

    const token = await getToken({
      req: req as NextRequest,
      secret: process.env.NEXTAUTH_SECRET
    })

    if (!token) {
      throw new Error('Token not found')
    }

    const db = await getDatabase()
    const collection = db.collection("devices")

    await collection.replaceOne(
      {
        vehicleId: 'vehicle',
        deviceId: 'device',
        owner: token.email!
      }, {
        vehicleId: 'vehicle',
        deviceId: 'device',
        lastUpdate: new Date().toUTCString(),
        owner: token.email!,
        fixed: false
      },
      {
        upsert: true
      }
    )

    const res = await GET(req as NextRequest, { params: {
      vehicleId: 'vehicle',
      deviceId: 'device'
    }})

    expect(res.status).toBe(200)  // Ok
  })
}) 
