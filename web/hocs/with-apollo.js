import React from "react"
import cookie from "cookie"
import PropTypes from "prop-types"
import Head from "next/head"
import { getDataFromTree } from "react-apollo"

import initApollo from "../utils/init-apollo"

function parseCookies(req, options = {}) {
  return cookie.parse(req ? req.headers.cookie || "" : document.cookie, options)
}

export default App => {
  return class WithData extends React.Component {
    static displayName = `WithData(${App.displayName})`
    static propTypes = {
      apolloState: PropTypes.object.isRequired
    }

    static async getInitialProps(ctx) {
      const {
        Component,
        router,
        ctx: { req, res }
      } = ctx
      const apollo = initApollo(
        {},
        {
          getToken: () => parseCookies(req).token
        }
      )

      ctx.ctx.apolloClient = apollo

      let appProps = {}
      if (App.getInitialProps) {
        appProps = await App.getInitialProps(ctx)
      }

      if (res && res.finished) {
        return {}
      }

      if (!process.browser) {
        try {
          await getDataFromTree(
            <App
              {...appProps}
              Component={Component}
              router={router}
              apolloClient={apollo}
            />
          )
        } catch (error) {
          console.error("Error while running `getDataFromTree`", error)
        }
        Head.rewind()
      }
      const apolloState = apollo.cache.extract()

      return {
        ...appProps,
        apolloState
      }
    }

    constructor(props) {
      super(props)
      this.apolloClient = initApollo(props.apolloState, {
        getToken: () => {
          return parseCookies().token
        }
      })
    }

    render() {
      return <App {...this.props} apolloClient={this.apolloClient} />
    }
  }
}
