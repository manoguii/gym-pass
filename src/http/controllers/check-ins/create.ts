import { makeCheckInUseCase } from '@/useCases/factories/make-check-in-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createCheckInParamsSquema = z.object({
    gymId: z.string(),
  })

  const createCheckInBodySquema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { latitude, longitude } = createCheckInBodySquema.parse(request.body)

  const { gymId } = createCheckInParamsSquema.parse(request.params)

  const createCheckInGymUseCase = makeCheckInUseCase()

  await createCheckInGymUseCase.execute({
    userId: request.user.sub,
    userLongitude: longitude,
    userLatitude: latitude,
    gymId,
  })

  return reply.status(201).send()
}
