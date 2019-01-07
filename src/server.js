import '@babel/polyfill'
import express from 'express'
import { ApolloServer, ApolloError } from 'apollo-server-express'
import { config } from 'dotenv'
import resolvers from './resolvers'
import typeDefs from './typeDefs'

// Run Config to access .env file constants
config()

// Import necesary env files
const { PORT, NODE_ENV } = process.env;

// Create an async self invoking function
(async () => {
  try {
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      playground: NODE_ENV !== 'production',
      debug: NODE_ENV !== 'production'
    })
    const app = express()
    server.applyMiddleware({ app })

    // Disable powered by header
    app.disable('x-powered-by')

    app.listen({ port: PORT }, () =>
      console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
    )
  } catch (e) {
    console.log(e)
    throw new ApolloError('Internal Server Error')
  }
})()
