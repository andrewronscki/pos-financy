import { gql } from "@apollo/client"

export const UPDATE_USER = gql`
  mutation UpdateUser($data: UpdateUserInput!, $id: String!) {
    updateUser(data: $data, id: $id) {
      id
      name
      email
    }
  }
`

