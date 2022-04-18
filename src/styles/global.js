import { css } from '@emotion/react'

import theme from 'theme'
import { fontSizes } from 'theme/breakpoints'

const { letterSpacings, breakpoints } = theme

export const globalStyles = () => css`
  :root {
    font-size: ${fontSizes.base};
    @media screen and (min-width: ${breakpoints.sm}) {
      font-size: ${fontSizes.sm};
    }
    @media screen and (min-width: ${breakpoints.md}) {
      font-size: ${fontSizes.md};
    }
    @media screen and (min-width: ${breakpoints.lg}) {
      font-size: ${fontSizes.lg};
    }
  }
  html,
  body {
    max-width: 100vw;
    letter-spacing: ${letterSpacings.wider};
    min-height: -webkit-fill-available;
    font-family: ${theme.fonts.body};
  }
  body {
    min-height: 100vh;
  }
  code {
    font-size: 0.92em;
    padding: 2px;
    border-radius: 0.25em;
    background-color: #e9e9e9;
    overflow-x: auto;
  }
  * {
    -webkit-tap-highlight-color: transparent;
  }
  .js-focus-visible :focus:not([data-focus-visible-added]) {
    outline: none;
    box-shadow: none;
  }
  .visually-hidden {
    border: 0px;
    clip: rect(0px, 0px, 0px, 0px);
    height: 1px;
    width: 1px;
    margin: -1px;
    padding: 0px;
    overflow: hidden;
    white-space: nowrap;
    position: absolute;
    top: -9999px !important;
    left: -9999px !important;
  }
  :-webkit-autofill,
  :-webkit-autofill:hover,
  :-webkit-autofill:focus,
  :-webkit-autofill:active {
    transition: background-color 5000s ease-in-out 0s;
  }
`
