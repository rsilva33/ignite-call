import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { buildNextAuthOptions } from '../auth/[...nextAuth].api'

const timeIntervalsBodySchema = z.object({
  intervals: z.array(
    z.object({
      weekDay: z.number(),
      startTimeInMinutes: z.number(),
      endTimeInMinutes: z.number(),
    }),
  ),
})

// Cadastra os intervalos de tempo que usuario tem de disponibilidade
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }
  // obtendo informacoes de usuario logado
  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  )
  if (!session) {
    return res.status(401).end()
  }

  // parse ja retorna os dados tipado
  // safeParse -> faz o parse mas nao retorna o erro
  const { intervals } = timeIntervalsBodySchema.parse(req.body)

  // Promise.all cria todos registro ao mesmo tempo
  await Promise.all(
    // percorre cada um dos intervalos
    intervals.map((interval) => {
      // createMany seria o ideal, sqlite nao suporta trabalhar com insert multiplo
      return prisma.userTimeInterval.create({
        data: {
          week_day: interval.weekDay,
          time_start_in_minutes: interval.startTimeInMinutes,
          time_end_in_minutes: interval.endTimeInMinutes,
          user_id: session.user?.id,
        },
      })
    }),
  )

  // apenas para info -> return res.json({ session,}), nao e necessario retornar os dados em prod
  return res.status(201).end()
}
