const { gql } = require('graphql-tag');

const userTypeDefs = gql`
  type User {
    id: ID!
    username: String!
    role: UserRole!
    kode_unit: String!
    created_at: DateTime!
    updated_at: DateTime!
  }

  enum UserRole {
    OPERATOR
    VERIFIKATOR
  }

  input LoginInput {
    username: String!
    password: String!
  }

  type LoginResponse {
    user: User!
    token: String!
  }

  extend type Query {
    me: User
  }

  extend type Mutation {
    login(input: LoginInput!): LoginResponse!
  }
`;

module.exports = userTypeDefs;
