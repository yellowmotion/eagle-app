import { expect, test, describe, beforeAll, afterAll } from '@jest/globals';
import { NextRequest } from 'next/server';
import { GET } from './route';
import { faker } from '@faker-js/faker';

describe('GET /api/configurations/list/vehicle/device/:vehicleId/:deviceId', () => {

  test('Authorization header missing', async () => {
    
    const req = new Request('http://domain/api/configurations/list/vehicle/device', {
      method: 'GET',
    })

    const res = await GET(req as NextRequest, {
      params: {
        vehicleId: 'vehicle',
        deviceId: 'device'
      }
    })

    expect(res.status).toBe(401)  // Unauthorized 
  })

  test('Authorization header incomplete', async () => {
    
    const req = new Request('http://domain/api/configurations/list/vehicle/device', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ',
      }
    })

    const res = await GET(req as NextRequest, {
      params: {
        vehicleId: 'vehicle',
        deviceId: 'device'
      }
    })

    expect(res.status).toBe(401)  // Unauthorized
  })

  test('Authorization header with wrong token', async () => {
    
    const req = new Request('http://domain/api/configurations/list/vehicle/device', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer surelynotavalidtoken',
      }
    })

    const res = await GET(req as NextRequest, {
      params: {
        vehicleId: 'vehicle',
        deviceId: 'device'
      }
    })

    expect(res.status).toBe(401)  // Unauthorized
  })

  test('Authorization header with wrong prefix', async () => {
    
    const req = new Request('http://domain/api/configurations/list/vehicle/device', {
      method: 'GET',
      headers: {
        'Authorization': `Beer ${process.env.TESTING_VALID_TOKEN}`
      }
    })

    const res = await GET(req as NextRequest, {
      params: {
        vehicleId: 'vehicle',
        deviceId: 'device'
      }
    })

    expect(res.status).toBe(401)  // Unauthorized
  })

  test('Request not existing device configurations', async () => {
    
    const req = new Request('http://domain/api/configurations/list/vehicle/device', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.TESTING_VALID_TOKEN}`
      }
    })

    const res = await GET(req as NextRequest, {
      params: {
        vehicleId: faker.string.alphanumeric(20),
        deviceId: faker.string.alphanumeric(20)
      }
    })

    expect(res.status).toBe(200)  // Ok
    expect(await res.json()).toEqual([])
  })

  test('Request existing device configurations', async () => {
    
    const req = new Request('http://domain/api/configurations/list/vehicle/device', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.TESTING_VALID_TOKEN}`
      }
    })

    const res = await GET(req as NextRequest, {
      params: {
        vehicleId: 'vehicle',
        deviceId: 'device'
      }
    })

    expect(res.status).toBe(200)  // Ok
  })
})  
