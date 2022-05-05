import { Grid, Box, Heading } from '@chakra-ui/react'

import Initializer from 'components/initializer'
import Taker from 'components/taker'

function Home() {
  return (
    <Box px={6} py={10}>
      <Heading as="h2" mb={20} textAlign="center">
        Escrow Program UI
      </Heading>

      <Grid templateColumns={'repeat(2, 1fr)'}>
        <Initializer />
        <Taker />
      </Grid>
    </Box>
  )
}

export default Home
