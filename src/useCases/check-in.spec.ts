import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CheckInUseCase } from './check-in'
import { MaxDistance } from './errors/max-distance'
import { MaxNumberCheckIns } from './errors/max-number-check-ins'

let checkInRepository: InMemoryCheckInsRepository

let gymsRepository: InMemoryGymsRepository

let sut: CheckInUseCase

describe('Check-in useCase', () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository()

    gymsRepository = new InMemoryGymsRepository()

    sut = new CheckInUseCase(checkInRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      description: '',
      phone: '',
      title: 'Academia Java Scrit',
      latitude: -19.8289387,
      longitude: -44.1506726,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -19.8289387,
      userLongitude: -44.1506726,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -19.8289387,
      userLongitude: -44.1506726,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -19.8289387,
        userLongitude: -44.1506726,
      }),
    ).rejects.toBeInstanceOf(MaxNumberCheckIns)
  })

  it('should be able to check in twice but in different dayy', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -19.8289387,
      userLongitude: -44.1506726,
    })

    vi.setSystemTime(new Date(2022, 3, 22, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -19.8289387,
      userLongitude: -44.1506726,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      description: '',
      phone: '',
      title: 'Academia Eldorado',
      latitude: new Decimal(-19.9411732),
      longitude: new Decimal(-44.071446),
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -19.8289387,
        userLongitude: -44.1506726,
      }),
    ).rejects.toBeInstanceOf(MaxDistance)
  })
})
