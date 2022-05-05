import { Stack, Button, Heading, Grid } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'

import Input from 'components/input'
import FormLabel from 'components/form-label'
import FormControl from 'components/form-control'
import { takeTrade } from 'utils/escrow'

function Initializer() {
  const { register, handleSubmit } = useForm()

  const onSubmit = async (data) => {
    const {
      privateKey,
      programId,
      tokenToReceiveAccountPubkey,
      tokenAccountPubkey,
      escrowAccountPubkey,
      xTokenAmount,
    } = data

    try {
      await takeTrade(
        privateKey,
        escrowAccountPubkey,
        tokenToReceiveAccountPubkey,
        tokenAccountPubkey,
        xTokenAmount,
        programId,
      )
      alert('Success! Alice and Bob have traded their tokens and all temporary accounts have been closed')
    } catch (err) {
      if (err instanceof Error) {
        console.error(err)
      } else {
        console.error('A message-less error occurred')
      }
    }
  }

  return (
    <Stack spacing={8} align="center" px={20}>
      <Heading as="h3" fontSize={'3xl'}>
        Taker
      </Heading>

      <Stack as="form" onSubmit={handleSubmit(onSubmit)} spacing={4} align="center">
        <FormControl>
          <FormLabel htmlFor="privateKey" fontSize="sm">
            Private Key
          </FormLabel>
          <Input id="privateKey" placeholder="as byte array without []" {...register('privateKey')} />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="programId">Program Id</FormLabel>
          <Input id="programId" placeholder="where the program is deployed" {...register('programId')} />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="tokenToReceiveAccountPubkey">{"Taker's X token account pubkey"}</FormLabel>
          <Input id="tokenToReceiveAccountPubkey" {...register('tokenToReceiveAccountPubkey')} />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="tokenAccountPubkey">{"Taker's Y token account pubkey"}</FormLabel>
          <Input id="tokenAccountPubkey" {...register('tokenAccountPubkey')} />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="escrowAccountPubkey">{'Escrow account pubkey'}</FormLabel>
          <Input id="escrowAccountPubkey" {...register('escrowAccountPubkey')} />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="xTokenAmount">{'X token amount'}</FormLabel>
          <Input id="xTokenAmount" placeholder="amount of X tokens that taker expects" {...register('xTokenAmount')} />
        </FormControl>

        <Grid templateColumns={'1fr 1fr'} width="full" columnGap={4} pt={4}>
          <Button variant="grayscale" width="full" rounded="md">
            reset
          </Button>
          <Button type="submit" variant="primary" rounded="md" width="full">
            take trade
          </Button>
        </Grid>
      </Stack>
    </Stack>
  )
}

export default Initializer
