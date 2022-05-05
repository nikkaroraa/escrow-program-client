import { Input as ChakraInput } from '@chakra-ui/react'
import { forwardRef } from 'react'

const Input = forwardRef((props, ref) => {
  return <ChakraInput ref={ref} width="64ch" background="#fefefe" focusBorderColor="#444" borderRadius={6} {...props} />
})

export default Input
