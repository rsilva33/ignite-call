import { Box, styled } from '@ignite-ui/react'

export const Container = styled(Box, {
  margin: '$6 auto 0',
  padding: 0,
  // ajuda a alinhar os elementos em tela
  display: 'grid',
  position: 'relative',

  width: 540,
  gridTemplateColumns: '1fr',
})
