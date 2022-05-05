import { FormLabel as ChakraFormLabel } from '@chakra-ui/react'

function FormLabel(props) {
  return <ChakraFormLabel fontSize="sm" mb={1} textTransform="lowercase" {...props} />
}

export default FormLabel
