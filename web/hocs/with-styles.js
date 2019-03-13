import React from "react"
import Head from "next/head"
import NProgress from "next-nprogress/component"
import ruRU from "antd/lib/locale-provider/ru_RU"
import { LocaleProvider } from "antd"
import { createGlobalStyle } from "styled-components"

import { Colors } from "../config/index"

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
      <NProgress color={Colors.primary} />
      <Component {...props} />
      <GlobalStyles />
    </React.Fragment>
  </LocaleProvider>
)

export default WithGlobalStyles
