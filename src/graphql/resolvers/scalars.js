const { GraphQLScalarType } = require('graphql');
const { GraphQLError } = require('graphql');
const { Kind } = require('graphql/language');

const scalarResolvers = {
  DateTime: new GraphQLScalarType({
    name: 'DateTime',
    description: 'DateTime custom scalar type',
    serialize(value) {
      // convert date -> string
      return value instanceof Date ? value.toISOString() : value;
    },
    parseValue(value) {
      // convert string -> date
      return new Date(value);
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return new Date(ast.value);
      }
      throw new GraphQLError(`Can only parse strings to dates but got a: ${ast.kind}`);
    },
  }),
};

module.exports = scalarResolvers;
