import { describe, test, expect, beforeAll, afterAll } from '@jest/globals'
import { GET } from './route'
import { NextRequest } from 'next/server'

describe('GET /api/devices', () => {

  beforeAll(async () => {
    console.log('Starting Devices GET tests')
  })

  afterAll(async () => {
    console.log('Finishing Devices GET tests')
  })

  test('Authorization header missing', async () => {
    
    const req = new Request('http://domain/api/devices', {
      method: 'GET',
    })

    const res = await GET(req as NextRequest)

    expect(res.status).toBe(401)  // Unauthorized
  })

  test('Authorization header token wrong', async () => {

    const req = new Request('http://domain/api/devices', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer surelywrongtoken'
      },
    })

    const res = await GET(req as NextRequest)

    expect(res.status).toBe(401)  // Unauthorized
  })

  test('Authorization header prefix wrong', async () => {

    const req = new Request('http://domain/api/devices', {
      method: 'GET',
      headers: {
        'Authorization': `Beer ${process.env.TESTING_VALID_TOKEN}`
      },
    })

    const res = await GET(req as NextRequest)

    expect(res.status).toBe(401)  // Unauthorized
  })
  
  test('Correct request', async () => {
    
    const req = new Request('http://domain/api/devices', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.TESTING_VALID_TOKEN}`
      }
    })

    const res = await GET(req as NextRequest)

    expect(res.status).toBe(200)  // Ok
  })
}) 
