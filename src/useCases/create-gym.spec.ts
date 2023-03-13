import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateGymUseCase } from './create-gym'

let gymRepository: InMemoryGymsRepository

let sut: CreateGymUseCase

describe('Create gym useCase', () => {
  beforeEach(() => {
    gymRepository = new InMemoryGymsRepository()

    sut = new CreateGymUseCase(gymRepository)
  })

  it('should be able to create gym', async () => {
    const { gym } = await sut.execute({
      title: 'Academia do Marquinhos',
      latitude: -19.8289387,
      longitude: -44.1506726,
      description: '',
      phone: '',
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
