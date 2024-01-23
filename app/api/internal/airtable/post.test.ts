import { POST } from './route'
import { expect, test, describe } from '@jest/globals';
import { faker, fakerIT } from '@faker-js/faker'

// Path: app/api/internal/airtable/route.ts

describe("POST /api/configurations/internal/airtable", () => {

  test('Authorization header not set', async () => {

    const req = new Request('http://domain/api/internal/airtable', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        roles: [
          {
            email: fakerIT.internet.email(),
            role: faker.number.int({ min: 1, max: 3 })
          }
        ]
      })
    })

    const res = await POST(req) 
    expect(res.status).toBe(401)  // Unauthorized
  })

  test('Authorization header set but token missing', async () => {

    const req = new Request('http://domain/api/internal/airtable', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer'
      },
      body: JSON.stringify({
        roles: [
          {
            email: fakerIT.internet.email(),
            role: faker.number.int({ min: 1, max: 3 })
          }
        ]
      })
    })

    const res = await POST(req) 
    expect(res.status).toBe(401)  // Unauthorized
  })

  test('Authorization header set but prefix Bearer is wrong', async () => {

    const req = new Request('http://domain/api/internal/airtable', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Beer ${process.env.AIRTABLE_TOKEN}`
      },
      body: JSON.stringify({
        roles: [
          {
            email: fakerIT.internet.email(),
            role: faker.number.int({ min: 1, max: 3 })
          }
        ]
      })
    })

    const res = await POST(req) 
    expect(res.status).toBe(401)  // Unauthorized
  })

  test('Invalid Bearer token', async () => {

    const req = new Request('http://domain/api/internal/airtable', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer surelyinvalidtoken'
      },
      body: JSON.stringify({
        roles: [
          {
            email: fakerIT.internet.email(),
            role: faker.number.int({ min: 1, max: 3 })
          },
          {
            email: fakerIT.internet.email(),
            role: faker.number.int({ min: 1, max: 3 })
          }
        ]
      })
    })

    const res = await POST(req) 
    expect(res.status).toBe(401)  // Unauthorized
  })

  test('Request with empty body', async () => {

    const req = new Request('http://domain/api/internal/airtable', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.AIRTABLE_TOKEN}`
      },
    })

    const res = await POST(req) 
    expect(res.status).toBe(400)  // Bad request 
  })

  test('Request with invalid JSON body', async () => {

    const req = new Request('http://domain/api/internal/airtable', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.AIRTABLE_TOKEN}`
      },
      body: JSON.stringify({
        roles: [
          {
            email: fakerIT.internet.email(),
            role: faker.number.int({ min: 1, max: 3 })
          },
          {
            email: fakerIT.internet.email(),
            role: faker.number.int({ min: 1, max: 3 })
          }
        ]
      }).substring(0, -2)
    })

    const res = await POST(req) 
    expect(res.status).toBe(400)  // Bad request 
  })

  test('Request with missing fields', async () => {

    const req = new Request('http://domain/api/internal/airtable', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.AIRTABLE_TOKEN}`
      },
      body: JSON.stringify({
        roles: [
          {
            email: fakerIT.internet.email(),
            role: faker.number.int({ min: 1, max: 3 })
          },
          {
            email: fakerIT.internet.email(),
          }
        ]
      })
    })

    const res = await POST(req) 
    expect(res.status).toBe(400)  // Bad request 
  })

  test('Request with wrong type fields', async () => {

    const req = new Request('http://domain/api/internal/airtable', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.AIRTABLE_TOKEN}`
      },
      body: JSON.stringify({
        roles: [
          {
            email: fakerIT.number.float(),  // Not string
            role: faker.number.int({ min: 1, max: 3 })
          },
          {
            email: fakerIT.internet.email(),
            role: fakerIT.number.int({ min: 256, max: 500 })  // Overflow
          }
        ]
      })
    })

    const res = await POST(req) 
    expect(res.status).toBe(400)  // Bad request 
  })

  test('Correct request', async () => {

    const req = new Request('http://domain/api/internal/airtable', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.AIRTABLE_TOKEN}`
      },
      body: JSON.stringify({
        roles: [
          {
            email: fakerIT.internet.email(),
            role: faker.number.int({ min: 1, max: 3 })
          },
          {
            email: fakerIT.internet.email(),
            role: faker.number.int({ min: 1, max: 3 })
          }
        ]
      })
    })

    const res = await POST(req) 
    expect(res.status).toBe(200)  // Ok
  })
})
