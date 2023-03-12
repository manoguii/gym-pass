import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentials } from './errors/invalid-credentials'

// System Under Test ( SUT )

let userRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate useCase', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()

    sut = new AuthenticateUseCase(userRepository)
  })

  it('should be able to authenticate', async () => {
    await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      email: 'johndoe@mail.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      password_hash: await hash('123456', 6),
    })

    await expect(async () => {
      await sut.execute({
        email: 'incorrect-email@teste.com',
        password: '123456',
      })
    }).rejects.toBeInstanceOf(InvalidCredentials)
  })

  it('should not be able to authenticate with wrong password', async () => {
    await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      password_hash: await hash('123456', 6),
    })

    await expect(async () => {
      await sut.execute({
        email: 'johndoe@mail.com',
        password: 'incorrect-password',
      })
    }).rejects.toBeInstanceOf(InvalidCredentials)
  })
})
