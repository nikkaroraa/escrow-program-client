import { Stack, Button, Heading, Grid, Text } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { useState } from 'react'

import Input from 'components/input'
import FormLabel from 'components/form-label'
import FormControl from 'components/form-control'
import { initEscrow } from 'utils/escrow'

function Initializer() {
  const [escrowState, setEscrowState] = useState({})
  const { register, handleSubmit } = useForm()

  const onSubmit = async (data) => {
    const { privateKey, programId, tokenAccountPubkey, tokenToReceiveAccountPubkey, xTokenAmount, yTokenAmount } = data

    try {
      const {
        escrowAccountPubkey,
        isInitialized,
        initializerAccountPubkey,
        XTokenTempAccountPubkey,
        initializerYTokenAccount,
        expectedAmount,
      } = await initEscrow(
        privateKey,
        tokenAccountPubkey,
        xTokenAmount,
        tokenToReceiveAccountPubkey,
        yTokenAmount,
        programId,
      )

      setEscrowState({
        escrowAccountPubkey,
        isInitialized,
        initializerAccountPubkey,
        XTokenTempAccountPubkey,
        initializerYTokenAccount,
        expectedAmount,
      })
    } catch (error) {
      if (error instanceof Error) {
        console.error(error)
      } else {
        console.error('A message-less error occurred')
      }
    }
  }

  return (
    <Stack spacing={8} align="center" px={20}>
      <Heading as="h3" fontSize={'3xl'}>
        Initializer
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
          <FormLabel htmlFor="tokenAccountPubkey">{"Initializer's X token account pubkey"}</FormLabel>
          <Input id="tokenAccountPubkey" {...register('tokenAccountPubkey')} />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="tokenToReceiveAccountPubkey">{"Initializer's Y token account pubkey"}</FormLabel>
          <Input id="tokenToReceiveAccountPubkey" {...register('tokenToReceiveAccountPubkey')} />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="xTokenAmount">{'X token amount'}</FormLabel>
          <Input
            id="xTokenAmount"
            placeholder="amount of X tokens to send to the escrow"
            {...register('xTokenAmount')}
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="yTokenAmount">{'Y token amount'}</FormLabel>
          <Input
            id="yTokenAmount"
            placeholder="amount of Y tokens to receive in return"
            {...register('yTokenAmount')}
          />
        </FormControl>

        <Grid templateColumns={'1fr 1fr'} width="full" columnGap={4} pt={4}>
          <Button type="reset" variant="grayscale" width="full" rounded="md">
            reset
          </Button>
          <Button type="submit" variant="primary" rounded="md" width="full">
            create escrow
          </Button>
        </Grid>
      </Stack>

      <Heading as="h3" fontSize={'2xl'}>
        Trade Info
      </Heading>
      <Stack>
        <Stack isInline>
          <Text>Escrow Account:</Text>
          <Text>{escrowState.escrowAccountPubkey ?? '--'}</Text>
        </Stack>

        <Text>Decoded State:</Text>
        <Stack isInline>
          <Text>Is initialized:</Text>
          <Text>{escrowState.isInitialized ? 'true' : '--'}</Text>
        </Stack>

        <Stack isInline>
          <Text>Initializer account:</Text>
          <Text>{escrowState.initializerAccountPubkey ?? '--'}</Text>
        </Stack>

        <Stack isInline>
          <Text>X token temp account:</Text>
          <Text>{escrowState.XTokenTempAccountPubkey ?? '--'}</Text>
        </Stack>

        <Stack isInline>
          <Text>Initializer Y token account:</Text>
          <Text>{escrowState.initializerYTokenAccount ?? '--'}</Text>
        </Stack>

        <Stack isInline>
          <Text>Expected Amount:</Text>
          <Text>{escrowState.expectedAmount ?? '--'}</Text>
        </Stack>
      </Stack>
    </Stack>
  )
}

export default Initializer
