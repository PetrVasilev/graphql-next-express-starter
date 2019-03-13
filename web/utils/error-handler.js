import { message } from 'antd'

export const RequestError = (err) => {
  console.error(err)
  if (err.networkError) {
    return message.error('Ошибка сети... Проверьте подключение к интернету')
  }
  if (err.graphQLErrors) {
    return err.graphQLErrors.forEach(e => {
      message.error(e.message.toString())
    })
  }
  return message.error('Неизвестная ошибка')
}
