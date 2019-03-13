import express from "express"
import mongoose, { model } from "mongoose"
import dotenv from "dotenv"
import { createServer } from "http"
import { PubSub } from "apollo-server"
import { ApolloServer } from "apollo-server-express"
import { importSchema } from "graphql-import"

import resolvers from "./resolvers"
import models from "./models"
import { CheckUserLogged } from "./utils/logged"

// настройка глобальных переменных
dotenv.config()

// настройка сервера
const app = express()
const PORT = process.env.SERVER_PORT || 3000
app.use("/public", express.static(__dirname + "/../uploads/"))

// база данных
const mongoURL = process.env.MONGO_URL || "mongodb://localhost:27017/project"
mongoose.connect(mongoURL, { useNewUrlParser: true })
mongoose.set("useCreateIndex", true)
mongoose.set("useFindAndModify", false)
const db = mongoose.connection
db.on("error", console.error.bind(console, "Mongo connection ERROR :("))
db.once("open", () => {
  console.log(`Mongo connected to ${mongoURL} :)`)
})

export const pubsub = new PubSub()

// настройка graphql
const server = new ApolloServer({
  typeDefs: importSchema("./schemas/index.graphql"),
  resolvers,
  context: async ({ req, connection }) => {
    if (connection) {
      return {
        ...connection.context,
        pubsub
      }
    } else {
      const { authorization } = req.headers
      const userAuth = await CheckUserLogged(authorization)
      return {
        ...models,
        userAuth
      }
    }
  },
  playground: process.env.NODE_ENV !== "production" ? true : false
})

// запуск сервера
const httpServer = createServer(app)
server.applyMiddleware({
  app,
  path: "/graphql",
  bodyParserConfig: { limit: "15mb" }
})
server.installSubscriptionHandlers(httpServer)

httpServer.listen(PORT, async (req, res) => {
  console.log(`Server started at port ${PORT} :)`)
  models.User.initDB()
})
