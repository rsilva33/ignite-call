import { Avatar, Heading, Text } from '@ignite-ui/react'
import { GetStaticPaths, GetStaticProps } from 'next'
import { prisma } from '@/lib/prisma'
import { ScheduleForm } from './ScheduleForm'
import { Container, UserHeader } from './styles'

interface ScheduleProps {
  user: {
    name: string
    bio: string
    avatarUrl: string
  }
}

export default function Schedule({ user }: ScheduleProps) {
  return (
    <Container>
      <UserHeader>
        <Avatar src={user.avatarUrl} />
        <Heading>{user.name}</Heading>
        <Text>{user.bio}</Text>
      </UserHeader>

      <ScheduleForm />
    </Container>
  )
}
// gerendo uma pagina por usuario, utilizar obtigatoriamente,
// GetStaticPaths -> diz para o next   quais sao os usuarios que querem gerar a pagina estatica no momento do build da aplicacao
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    // quando tentar acessar uma pagiona que nao foi gerada de forma estatica so sera apresentado quando estiver pronta
    fallback: 'blocking',
  }
}
// comportamento de pagina estatica e nao tem o req e res, sao criadas no momento da build e nao em tempo de execucao por isso utilizado o params
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const username = String(params?.username)

  // trabalhando do lado do servidor
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      user: {
        name: user.name,
        bio: user.bio,
        avatarUrl: user.avatar_url,
      },
    },
    // de quantos em quantos tempos a pagina sera recriada apos o primeiro acesso.
    revalidate: 60 * 60 * 24, // 1 day
  }
}
