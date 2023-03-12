import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { compare } from 'bcryptjs'
import { describe, expect, it } from 'vitest'
import { UserAlreadyExistsError } from './errors/user-already-exists'
import { RegisterUseCase } from './register'

describe('Register useCase', () => {
  it('should be able to register', async () => {
    const userRepository = new InMemoryUsersRepository()

    const registerUseCase = new RegisterUseCase(userRepository)

    const { user } = await registerUseCase.execute({
      name: 'Alejandro Martinez',
      email: 'ofwogiwo@ho.tr',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const userRepository = new InMemoryUsersRepository()

    const registerUseCase = new RegisterUseCase(userRepository)

    const { user } = await registerUseCase.execute({
      name: 'Alejandro Martinez',
      email: 'ofwogiwo@ho.tr',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const userRepository = new InMemoryUsersRepository()

    const registerUseCase = new RegisterUseCase(userRepository)

    const email = 'ofwogiwo@ho.tr'

    await registerUseCase.execute({
      name: 'Alejandro Martinez',
      email,
      password: '123456',
    })

    await expect(() =>
      registerUseCase.execute({
        name: 'Alejandro Martinez',
        email: 'ofwogiwo@ho.tr',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
