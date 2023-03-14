import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository

let sut: FetchNearbyGymsUseCase

describe('Fetch nearby gyms use case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()

    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      latitude: -19.8266151,
      longitude: -44.1572457,
      description: '',
      phone: '',
    })

    await gymsRepository.create({
      title: 'Far Gym',
      latitude: -19.9194589,
      longitude: -43.9039142,
      description: '',
      phone: '',
    })

    const { gyms } = await sut.execute({
      userLatitude: -19.8266151,
      userLongitude: -44.1572457,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
