import { gql } from "@apollo/client"

export const CREATE_CATEGORY = gql`
  mutation CreateCategory($data: CreateCategoryInput!) {
    createCategory(data: $data) {
      id
      title
      description
      icon
      color
      user {
        id
      }
    }
  }
`

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($data: UpdateCategoryInput!, $id: String!) {
    updateCategory(data: $data, id: $id) {
      id
      userId
      title
      description
      icon
      color
    }
  }
`

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: String!) {
    deleteCategory(id: $id)
  }
`

