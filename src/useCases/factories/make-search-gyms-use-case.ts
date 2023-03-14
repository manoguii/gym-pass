import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { SearchGymsUseCase } from '../search-gyms'

export function makeSearchGymsUseCase() {
  const prismaGymsRepository = new PrismaGymsRepository()

  const useCase = new SearchGymsUseCase(prismaGymsRepository)

  return useCase
}
