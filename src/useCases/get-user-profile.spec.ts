import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { ResourceNotFound } from './errors/resource-not-found'
import { GetUserProfileUseCase } from './get-user-profile'

// System Under Test ( SUT )

let userRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('Get User Profile useCase', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()

    sut = new GetUserProfileUseCase(userRepository)
  })

  it('should be able to get user profile', async () => {
    const createdUser = await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({ userId: createdUser.id })

    expect(user.name).toEqual('John Doe')
  })

  it('should not be able to get user profile with wrong id', async () => {
    await expect(async () => {
      await sut.execute({
        userId: 'non-exist-id',
      })
    }).rejects.toBeInstanceOf(ResourceNotFound)
  })
})
