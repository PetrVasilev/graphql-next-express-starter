import React from "react"
import gql from "graphql-tag"
import cookie from "cookie"
import { Typography, Button, message } from "antd"
import { Mutation, withApollo } from "react-apollo"

import { Container } from "./styles"
import { RequestError } from "../../utils/error-handler"
import { getMySelfQuery } from "../../utils/logged"
import redirect from '../../utils/redirect'

const { Title, Text, Paragraph } = Typography

const loginMutation = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        email
      }
    }
  }
`

class MainContainer extends React.Component {
  logout = () => {
    const { client } = this.props
    document.cookie = cookie.serialize("token", "", {
      maxAge: -1
    })
    client.cache.reset().then(() => {
      redirect({}, '/')
    })
  }
  render() {
    const { user, client } = this.props
    return (
      <Container>
        <Title level={2}>Добро пожаловать в стартовый проект</Title>
        <Paragraph>
          Стартовый проект содержит в себе - Next JS, Apollo-Client,
          Apollo-Server
        </Paragraph>
        <Text>{user ? "Авторизован" : "Не авторизован"}</Text>
        <Mutation
          mutation={loginMutation}
          variables={{ email: "user@mail.ru", password: "password" }}
          onCompleted={({ login: { token, user } }) => {
            message.success("Вход выполнен :)")
            document.cookie = cookie.serialize("token", token, {
              maxAge: 30 * 24 * 60 * 60 // 30 дней
            })
            client.cache.reset().then(() => {
              redirect({}, '/')
            })
          }}
          onError={err => {
            RequestError(err)
          }}
        >
          {(login, { loading }) => {
            if (user) {
              return (
                <React.Fragment>
                  <Text style={{ marginTop: 10 }}>ID: {user._id}</Text>
                  <Text>Email: {user.email}</Text>
                  <Button
                    onClick={this.logout}
                    loading={loading}
                    type="primary"
                  >
                    Выйти
                  </Button>
                </React.Fragment>
              )
            } else {
              return (
                <Button onClick={login} loading={loading} type="primary">
                  Войти
                </Button>
              )
            }
          }}
        </Mutation>
      </Container>
    )
  }
}

export default withApollo(MainContainer)
