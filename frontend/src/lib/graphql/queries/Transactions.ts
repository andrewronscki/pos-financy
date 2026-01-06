import { gql } from "@apollo/client"

export const LIST_TRANSACTIONS = gql`
  query ListTransactions {
    listTransactions {
      id
      categoryId
      userId
      date
      type
      description
      amount
    }
  }
`

