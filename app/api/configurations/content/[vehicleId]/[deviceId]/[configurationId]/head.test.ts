import { NextRequest } from 'next/server';
import { HEAD } from './route'
import { expect, test, describe, beforeAll, afterAll } from '@jest/globals';

// Path: /api/configurations/content/:vehicleId/:deviceId/:configurationId

describe('HEAD /api/configurations/content/:vehicleId/:deviceId/:configurationId', () => {

  beforeAll(async () => {
    console.log('Starting Configurations Content HEAD tests')
  })

  afterAll(async () => {
    console.log('Finishing Configurations Content HEAD tests')
  })
  
  test('Authorization header not set', async () => {  

    const req = new Request('http://domain/api/configurations/content/vehicle/device/configuration', {
      method: 'HEAD'
    })

    const res = await HEAD(req as NextRequest, {
      params: {
        vehicleId: 'vehicle',
        deviceId: 'device',
        configurationId: 'configuration'
      }
    }) 

    expect(res.status).toBe(401)  // Unauthorized
  })

  test('Authorization header set but token missing', async () => {
    
    const req = new Request('http://domain/api/configurations/content/vehicle/device/configuration', {
      method: 'HEAD',
      headers: {
        'Authorization': 'Bearer '
      }
    })

    const res = await HEAD(req as NextRequest, {
      params: {
        vehicleId: 'vehicle',
        deviceId: 'device',
        configurationId: 'configuration'
      }
    })

    expect(res.status).toBe(401)  // Unauthorized
  })

  test('Authorization header set but token invalid', async () => {
    
    const req = new Request('http://domain/api/configurations/content/vehicle/device/configuration', {
      method: 'HEAD',
      headers: {
        'Authorization': 'Bearer surelynotavalidtoken'
      }
    })

    const res = await HEAD(req as NextRequest, {
      params: {
        vehicleId: 'vehicle',
        deviceId: 'device',
        configurationId: 'configuration'
      }
    })

    expect(res.status).toBe(401)  // Unauthorized
  })
  
  test('Authorization header set but prefix Bearer is wrong', async () => {
    
    const req = new Request('http://domain/api/configurations/content/vehicle/device/configuration', {
      method: 'HEAD',
      headers: {
        'Authorization': `Beer ${process.env.AIRTABLE_TOKEN}`
      }
    })

    const res = await HEAD(req as NextRequest, {
      params: {
        vehicleId: 'vehicle',
        deviceId: 'device',
        configurationId: 'configuration'
      }
    })

    expect(res.status).toBe(401)  // Unauthorized
  })

  test('Request with unknown configuration', async () => {
      
    const req = new Request('http://domain/api/configurations/content/vehicle/device/configuration', {
      method: 'HEAD',
      headers: {
        'Authorization': `Bearer ${process.env.TESTING_VALID_TOKEN}`
      }
    })

    const res = await HEAD(req as NextRequest, {
      params: {
        vehicleId: 'vehicle',
        deviceId: 'device',
        configurationId: 'not_existing_configuration'
      }
    })

    expect(res.status).toBe(404)  // Not found
  })

  test('Request a configuration with missing state fields', async () => {
    
    const req = new Request('http://domain/api/configurations/content/vehicle/device/configuration', {
      method: 'HEAD',
      headers: {
        'Authorization': `Bearer ${process.env.TESTING_VALID_TOKEN}`
      }
    })

    const res = await HEAD(req as NextRequest, {
      params: {
        vehicleId: 'vehicle',
        deviceId: 'device',
        configurationId: 'missing_fields_configuration'
      }
    })

    expect(res.status).toBe(500)  // Server error
  })

  test('Request with known configuration', async () => {

    const req = new Request('http://domain/api/configurations/content/vehicle/device/configuration', {
      method: 'HEAD',
      headers: {
        'Authorization': `Bearer ${process.env.TESTING_VALID_TOKEN}`
      }
    })

    const res = await HEAD(req as NextRequest, {
      params: {
        vehicleId: 'vehicle',
        deviceId: 'device',
        configurationId: 'configuration'
      }
    })

    expect(res.status).toBe(200)  // Ok
  })
}) 
