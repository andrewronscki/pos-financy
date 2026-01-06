import { gql } from "@apollo/client"

export const CREATE_TRANSACTION = gql`
  mutation CreateTransaction($data: CreateTransactionInput!) {
    createTransaction(data: $data) {
      id
      categoryId
      type
      description
      date
      amount
    }
  }
`

export const UPDATE_TRANSACTION = gql`
  mutation UpdateTransaction($data: UpdateTransactionInput!, $id: String!) {
    updateTransaction(data: $data, id: $id) {
      id
      amount
      type
    }
  }
`

export const DELETE_TRANSACTION = gql`
  mutation DeleteTransaction($id: String!) {
    deleteTransaction(id: $id)
  }
`

