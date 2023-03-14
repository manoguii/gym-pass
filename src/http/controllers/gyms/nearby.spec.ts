import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Nearby gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('shold be able to list nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JavaScript gym',
        description: 'JavaScript gym LTDA',
        phone: '983824284',
        latitude: -19.8266151,
        longitude: -44.1572457,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Joãozinho gym',
        description: 'Joãozinho gym UTC',
        phone: '992343245',
        latitude: -19.9194589,
        longitude: -43.9039142,
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -19.8266151,
        longitude: -44.1572457,
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'JavaScript gym',
      }),
    ])
  })
})
