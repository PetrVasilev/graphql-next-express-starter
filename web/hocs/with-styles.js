import React from "react"
import Head from "next/head"
import ruRU from "antd/lib/locale-provider/ru_RU"
import { LocaleProvider } from "antd"
import { createGlobalStyle } from "styled-components"

const GlobalStyles = createGlobalStyle`
  body {
    padding: 0;
    margin: 0;
    background: white !important;
  }
`

const WithGlobalStyles = Component => props => (
  <LocaleProvider locale={ruRU}>
    <React.Fragment>
      <Component {...props} />
      <GlobalStyles />
    </React.Fragment>
  </LocaleProvider>
)

export default WithGlobalStyles
