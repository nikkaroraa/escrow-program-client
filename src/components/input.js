import { Input as ChakraInput } from '@chakra-ui/react'

function Input(props) {
  return <ChakraInput width="64ch" background="#fefefe" focusBorderColor="#444" borderRadius={6} {...props} />
}

export default Input
