import { NextRequest } from 'next/server';
import { GET } from './route'
import { expect, test, describe, beforeAll, afterAll } from '@jest/globals';

describe('GET /api/configurations/schema/:hash/:configurationId', () => {
  
  beforeAll(async () => {
    console.log('Starting Configurations Schema GET tests')
  })

  afterAll(async () => {
    console.log('Finishing Configurations Schema GET tests')
  })

  test('Authorization header missing', async () => {
    
    const req = new Request('http://domain/api/configurations/schema', {
      method: 'GET',
    })

    const res = await GET(req as NextRequest, {
      params: {
        hash: `${process.env.TESTING_CONFIGURATION_VERSION_HASH}`,
        configurationId: 'configuration'
      }
    })

    expect(res.status).toBe(401)  // Unauthorized 
  })

  test('Authorization header incomplete', async () => {

    const req = new Request('http://domain/api/configurations/schema', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ',
      }
    })

    const res = await GET(req as NextRequest, {
      params: {
        hash: `${process.env.TESTING_CONFIGURATION_VERSION_HASH}`,
        configurationId: 'configuration'
      }
    })

    expect(res.status).toBe(401)  // Unauthorized
  })

  test('Authorization header with wrong token', async () => {

    const req = new Request('http://domain/api/configurations/schema', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer surelynotavalidtoken',
      }
    })

    const res = await GET(req as NextRequest, {
      params: {
        hash: `${process.env.TESTING_CONFIGURATION_VERSION_HASH}`,
        configurationId: 'configuration'
      }
    })

    expect(res.status).toBe(401)  // Unauthorized
  })

  test('Authorization header with wrong prefix', async () => {

    const req = new Request('http://domain/api/configurations/schema', {
      method: 'GET',
      headers: {
        'Authorization': `Beer ${process.env.TESTING_VALID_TOKEN}`,
      }
    })

    const res = await GET(req as NextRequest, {
      params: {
        hash: `${process.env.TESTING_CONFIGURATION_VERSION_HASH}`,
        configurationId: 'configuration'
      }
    })

    expect(res.status).toBe(401)  // Unauthorized
  })

  test('Request not existent schemabinding', async () => {
    
    const req = new Request('http://domain/api/configurations/schema', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.TESTING_VALID_TOKEN}`
      }
    })

    const res = await GET(req as NextRequest, {
      params: {
        hash: `${process.env.TESTING_CONFIGURATION_VERSION_HASH}`,
        configurationId: 'configurationthatdoesnotexist'
      }
    })

    expect(res.status).toBe(404)  // Not Found
  })

  test('Request a schema with broken endpoint', async () => {
 
    const req = new Request('http://domain/api/configurations/schema', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.TESTING_VALID_TOKEN}`
      }
    })

    const res = await GET(req as NextRequest, {
      params: {
        hash: `${process.env.TESTING_CONFIGURATION_VERSION_HASH}`,
        configurationId: 'broken_endpoint_configuration'
      }
    })

    expect(res.status).toBe(500)  // Internal Server Error
  })

  test('Request an invalid schema', async () => {
    
    const req = new Request('http://domain/api/configurations/schema', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.TESTING_VALID_TOKEN}`
      }
    })

    const res = await GET(req as NextRequest, {
      params: {
        hash: `${process.env.TESTING_CONFIGURATION_VERSION_HASH}`,
        configurationId: 'wrong_schemabinding_configuration'
      }
    })

    expect(res.status).toBe(500)  // Internal Server Error
  })

  test('Request correct schema', async () => {
    
    const req = new Request('http://domain/api/configurations/schema/configuration/hash', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.TESTING_VALID_TOKEN}`
      }
    })

    const res = await GET(req as NextRequest, {
      params: {
        hash: `${process.env.TESTING_CONFIGURATION_VERSION_HASH}`,
        configurationId: 'configuration'
      }
    })

    expect(res.status).toBe(200)  // Ok
  })
})
  
