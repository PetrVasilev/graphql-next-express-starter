import React from "react"

import WithStyles from "../hocs/with-styles"
import { MainContainer } from "../containers"
import CheckLogged from "../utils/logged"

class MainPage extends React.Component {
  static async getInitialProps(context, apolloClient) {
    const { user } = await CheckLogged(context.apolloClient)
    return { user }
  }

  render() {
    const Component = WithStyles(MainContainer)
    return <Component {...this.props} />
  }
}

export default MainPage
