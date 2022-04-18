import PropTypes from 'prop-types'
import Head from 'next/head'
import { Global } from '@emotion/react'

import { globalStyles } from 'styles/global'

function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
      </Head>

      <Global styles={globalStyles()} />
      <Component {...pageProps} />
    </>
  )
}

App.propTypes = {
  Component: PropTypes.elementType,
  pageProps: PropTypes.shape(),
}

export default App
