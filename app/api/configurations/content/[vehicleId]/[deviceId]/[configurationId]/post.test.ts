import { NextRequest } from 'next/server';
import { POST } from './route'
import { expect, test, describe, beforeAll, afterAll } from '@jest/globals';

// Path: /api/configurations/content/:vehicleId/:deviceId/:configurationId

describe('POST /api/configurations/content/:vehicleId/:deviceId/:configurationId', () => {

  beforeAll(async () => {
    console.log('Starting Configurations Content POST tests')
  })

  afterAll(async () => {
    console.log('Finishing Configurations Content POST tests')
  })

  test('Authorization header missing', async () => {
    
    const req = new Request('http://domain/api/configurations/content/vehicle/device/configuration', {
      method: 'POST',
      headers: {
        'X-ConfigurationVersionHash': `${process.env.TESTING_CONFIGURATION_VERSION_HASH}`
      },
      body: JSON.stringify({
        temperature: 20,
        humidity: 40
      })
    })

    const res = await POST(req as NextRequest, {
      params: {
        vehicleId: 'vehicle',
        deviceId: 'device',
        configurationId: 'configuration'
      }
    })

    expect(res.status).toBe(401)  // Bad Request
  })

  test('Authorization header incomplete', async () => {
    
    const req = new Request('http://domain/api/configurations/content/vehicle/device/configuration', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ',
        'X-ConfigurationVersionHash': `${process.env.TESTING_CONFIGURATION_VERSION_HASH}`
      },
      body: JSON.stringify({
        temperature: 20,
        humidity: 40
      })
    })

    const res = await POST(req as NextRequest, {
      params: {
        vehicleId: 'vehicle',
        deviceId: 'device',
        configurationId: 'configuration'
      }
    })

    expect(res.status).toBe(401)  // Bad Request
  })

  test('Authorization header with wrong token', async () => {
    
    const req = new Request('http://domain/api/configurations/content/vehicle/device/configuration', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer surelynotavalidtoken',
        'X-ConfigurationVersionHash': `${process.env.TESTING_CONFIGURATION_VERSION_HASH}`
      },
      body: JSON.stringify({
        temperature: 20,
        humidity: 40
      })
    })

    const res = await POST(req as NextRequest, {
      params: {
        vehicleId: 'vehicle',
        deviceId: 'device',
        configurationId: 'configuration'
      }
    })

    expect(res.status).toBe(401)  // Bad Request
  })

  test('Authorization header with wrong prefix', async () => {
    
    const req = new Request('http://domain/api/configurations/content/vehicle/device/configuration', {
      method: 'POST',
      headers: {
        'Authorization': `Beer ${process.env.TESTING_VALID_TOKEN}`,
        'X-ConfigurationVersionHash': `${process.env.TESTING_CONFIGURATION_VERSION_HASH}`
      },
      body: JSON.stringify({
        temperature: 20,
        humidity: 40
      })
    })

    const res = await POST(req as NextRequest, {
      params: {
        vehicleId: 'vehicle',
        deviceId: 'device',
        configurationId: 'configuration'
      }
    })

    expect(res.status).toBe(401)  // Bad Request
  })

  test('Request without X-ConfigurationVersionHash header', async () => {
    
    const req = new Request('http://domain/api/configurations/content/vehicle/device/configuration', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TESTING_VALID_TOKEN}`
      },
      body: JSON.stringify({
        temperature: 20,
        humidity: 40
      })
    })

    const res = await POST(req as NextRequest, {
      params: {
        vehicleId: 'vehicle',
        deviceId: 'device',
        configurationId: 'configuration'
      }
    })

    expect(res.status).toBe(400)  // Bad request
  })

  test('Request to an unexisting configuration', async () => {
    
    const req = new Request('http://domain/api/configurations/content/vehicle/device/configuration', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TESTING_VALID_TOKEN}`,
        'X-ConfigurationVersionHash': `${process.env.TESTING_CONFIGURATION_VERSION_HASH}`
      },
      body: JSON.stringify({
        temperature: 20,
        humidity: 40
      })
    })

    const res = await POST(req as NextRequest, {
      params: {
        vehicleId: 'vehicle',
        deviceId: 'device',
        configurationId: 'unexisting'
      }
    })

    expect(res.status).toBe(404)  // Not found
  })

  test('Request a configuration without schema binding', async () => {

    const req = new Request('http://domain/api/configurations/content/vehicle/device/configuration', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TESTING_VALID_TOKEN}`,
        'X-ConfigurationVersionHash': `${process.env.TESTING_CONFIGURATION_VERSION_HASH}`
      },
      body: JSON.stringify({
        temperature: 20,
        humidity: 40
      })
    })

    const res = await POST(req as NextRequest, {
      params: {
        vehicleId: 'vehicle',
        deviceId: 'device',
        configurationId: 'no-schema-binding'
      }
    })

    expect(res.status).toBe(404)  // Bad request
  })

  test('Request a configuration with a wrong schema binding', async () => {

    const req = new Request('http://domain/api/configurations/content/vehicle/device/configuration', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TESTING_VALID_TOKEN}`,
        'X-ConfigurationVersionHash': `${process.env.TESTING_CONFIGURATION_VERSION_HASH}`
      },
      body: JSON.stringify({
        temperature: 20,
        humidity: 40
      })
    })

    const res = await POST(req as NextRequest, {
      params: {
        vehicleId: 'vehicle',
        deviceId: 'device',
        configurationId: 'wrong_schemabinding_configuration'
      }
    })

    expect(res.status).toBe(500)  // Server error
  })

  test('Request to push a wrong configuration', async () => {
    
    const req = new Request('http://domain/api/configurations/content/vehicle/device/configuration', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TESTING_VALID_TOKEN}`,
        'X-ConfigurationVersionHash': `${process.env.TESTING_CONFIGURATION_VERSION_HASH}`
      },
      body: JSON.stringify({
        temperature: 20,
        humidity: 'not a number'
      })
    })

    const res = await POST(req as NextRequest, {
      params: {
        vehicleId: 'vehicle',
        deviceId: 'device',
        configurationId: 'wrong_configuration'
      }
    })

    expect(res.status).toBe(400)  // Bad Request
  })

  test('Request to push a configuration with not owned configurationId', async () => {

    const req = new Request('http://domain/api/configurations/content/vehicle/device/configuration', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TESTING_VALID_TOKEN}`,
        'X-ConfigurationVersionHash': `${process.env.TESTING_CONFIGURATION_VERSION_HASH}`
      },
      body: JSON.stringify({
        temperature: 20,
        humidity: 40
      })
    })

    const res = await POST(req as NextRequest, {
      params: {
        vehicleId: 'another_vehicle',
        deviceId: 'device',
        configurationId: 'configuration'
      }
    })

    expect(res.status).toBe(404)  // Not Found 
  })

  test('Correct request', async () => {
    
    const req = new Request('http://domain/api/configurations/content/vehicle/device/configuration', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TESTING_VALID_TOKEN}`,
        'X-ConfigurationVersionHash': `${process.env.TESTING_CONFIGURATION_VERSION_HASH}`
      },
      body: JSON.stringify({
        temperature: 20,
        humidity: 40
      })
    })

    const res = await POST(req as NextRequest, {
      params: {
        vehicleId: 'vehicle',
        deviceId: 'device',
        configurationId: 'configuration'
      }
    })

    expect(res.status).toBe(200)  // Ok
  })
})
