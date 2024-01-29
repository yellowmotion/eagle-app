import { describe, test, expect, beforeAll, afterAll } from '@jest/globals'
import { NextRequest } from 'next/server'
import { PUT } from './route'
import { getToken } from 'next-auth/jwt'
import { getDatabase } from '@/lib/db'
import { faker } from '@faker-js/faker'

describe('PUT /api/devices', () => {
  
  beforeAll(async () => {
    console.log('Starting Devices PUT tests')
  })

  afterAll(async () => {
    console.log('Finishing Devices PUT tests')
  })

  test('Authorization header missing', async () => {
    
    const req = new Request('http://domain/api/devices', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        vehicleId: 'vehicle',
        deviceId: 'device'
      })
    })

    const res = await PUT(req as NextRequest)

    expect(res.status).toBe(401)  // Unauthorized
  })

  test('Authorization header incomplete', async () => {

    const req = new Request('http://domain/api/devices', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '
      },
      body: JSON.stringify({
        vehicleId: 'vehicle',
        deviceId: 'device'
      })
    })

    const res = await PUT(req as NextRequest)

    expect(res.status).toBe(401)  // Unauthorized
  })

  test('Authorization header token wrong', async () => {

    const req = new Request('http://domain/api/devices', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer surelywrongtoken'
      },
      body: JSON.stringify({
        vehicleId: 'vehicle',
        deviceId: 'device'
      })
    })

    const res = await PUT(req as NextRequest)

    expect(res.status).toBe(401)  // Unauthorized
  })

  test('Authorization header prefix wrong', async () => {

    const req = new Request('http://domain/api/devices', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Beer ${process.env.TESTING_VALID_TOKEN}`
      },
      body: JSON.stringify({
        vehicleId: 'vehicle',
        deviceId: 'device'
      })
    })

    const res = await PUT(req as NextRequest)

    expect(res.status).toBe(401)  // Unauthorized
  })

  test('Request with missing body', async () => {
    
    const req = new Request('http://domain/api/devices', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.TESTING_VALID_TOKEN}`
      }
    })

    const res = await PUT(req as NextRequest)

    expect(res.status).toBe(400)  // Bad Request 
  })

  test('Request with not valid JSON body', async () => {

    const req = new Request('http://domain/api/devices', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.TESTING_VALID_TOKEN}`
      },
      body: 'not valid JSON'
    })

    const res = await PUT(req as NextRequest)

    expect(res.status).toBe(400)  // Bad Request
  })

  test('Request with wrong body format', async () => {
    
    const req = new Request('http://domain/api/devices', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.TESTING_VALID_TOKEN}`
      },
      body: JSON.stringify({
        vehicleId: 'vehicle',
        deviceId: 1
      })
    })

    const res = await PUT(req as NextRequest)

    expect(res.status).toBe(400)  // Bad Request
  })

  test('Request trying to create already owned device', async () => {
    
    // Before running this test, you must create a device with the same email
    // of token used in the request. 

    const req = new Request('http://domain/api/devices', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.TESTING_VALID_TOKEN}`
      },
      body: JSON.stringify({
        vehicleId: 'vehicle',
        deviceId: 'owned_device'
      })
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
        deviceId: 'owned_device',
        owner: token.email!
      }, {
        vehicleId: 'vehicle',
        deviceId: 'owned_device',
        lastUpdate: new Date().toUTCString(),
        owner: token.email!,
        fixed: false
      },
      {
        upsert: true
      }
    )

    const res = await PUT(req as NextRequest)
    
    expect(res.status).toBe(409)  // Conflict
  })

  test('Request trying to create already fixed device', async () => {

    const req = new Request('http://domain/api/devices', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.TESTING_VALID_TOKEN}`
      },
      body: JSON.stringify({
        vehicleId: 'vehicle',
        deviceId: 'fixed_device'
      })
    })

    const res = await PUT(req as NextRequest)

    expect(res.status).toBe(409)  // Conflict
  })

  test('Request trying to create new device', async () => {

    const req = new Request('http://domain/api/devices', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.TESTING_VALID_TOKEN}`
      },
      body: JSON.stringify({
        vehicleId: 'vehicle',
        deviceId: faker.string.alphanumeric(20)
      })
    })

    const res = await PUT(req as NextRequest)

    expect(res.status).toBe(201)  // Created
  })
})
