import { gql } from 'apollo-server-express'

export default gql`

  extend type Query {
    requestBalance(
      username: String!
      password: String!
    ): Balance
  }

  type Balance {
    amount: String!
    accountNumber: String!
    owner: String!
    description: String!
  }

`
