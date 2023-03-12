import { UsersRepository } from '@/repositories/users-repository'
import { User } from '@prisma/client'
import { compare } from 'bcryptjs'
import { InvalidCredentials } from './errors/invalid-credentials'

interface AuthenticateUseCaseRequest {
  email: string
  password: string
}

interface AuthenticateUseCaseResponse {
  user: User
}

export class AuthenticateUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentials()
    }

    const thePasswordMatch = await compare(password, user.password_hash)

    if (!thePasswordMatch) {
      throw new InvalidCredentials()
    }

    return {
      user,
    }
  }
}
