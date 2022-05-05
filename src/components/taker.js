import { Stack, Button, Heading } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'

import Input from 'components/input'
import FormLabel from 'components/form-label'
import FormControl from 'components/form-control'

function Initializer() {
  const { register, handleSubmit } = useForm()

  const onSubmit = (data) => {
    console.log(data)
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

        <Button type="submit" variant="primary" width="full">
          take trade
        </Button>
      </Stack>
    </Stack>
  )
}

export default Initializer
