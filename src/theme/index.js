import { extendTheme } from '@chakra-ui/react'
import { colors } from './colors'
import { typography } from './typography'
import { breakpoints } from './breakpoints'
import { baseSizes, sizes } from './sizes'
import { zIndices } from './z-index'
import { radii } from './radii'
import { opacity } from './opacity'
import { shadows } from './shadows'
import { borders, borderWidths } from './borders'
import { icons } from './icons'
import { components } from './components'

const space = baseSizes

const overrides = {
  breakpoints,
  zIndices,
  radii,
  colors,
  ...typography,
  space,
  sizes,
  shadows,
  opacity,
  borders,
  borderWidths,
  icons,
  components,
}

const theme = extendTheme(overrides)

export default theme
