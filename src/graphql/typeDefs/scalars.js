const { gql } = require('graphql-tag');

const scalarTypeDefs = gql`
  scalar DateTime
`;

module.exports = scalarTypeDefs;
