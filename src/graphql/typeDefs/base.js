const { gql } = require('graphql-tag');

const baseTypeDefs = gql`
  type Query
  type Mutation
`;

module.exports = baseTypeDefs;
