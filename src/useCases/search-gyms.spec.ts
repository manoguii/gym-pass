import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { SearchGymsUseCase } from './search-gyms'

let gymsRepository: InMemoryGymsRepository

let sut: SearchGymsUseCase

describe('Search gyms use case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()

    sut = new SearchGymsUseCase(gymsRepository)
  })

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'Java Script',
      latitude: -19.4589387,
      longitude: -44.7606726,
      description: '',
      phone: '',
    })

    await gymsRepository.create({
      title: 'Type Script',
      latitude: -19.8289387,
      longitude: -44.1506726,
      description: '',
      phone: '',
    })

    const { gyms } = await sut.execute({
      query: 'Java',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Java Script' })])
  })

  it('should be able to fetch paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `JavaScript Gym-${i}`,
        latitude: -19.8289387,
        longitude: -44.1506726,
        description: '',
        phone: '',
      })
    }

    const { gyms } = await sut.execute({
      query: 'JavaScript',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'JavaScript Gym-21' }),
      expect.objectContaining({ title: 'JavaScript Gym-22' }),
    ])
  })
})
