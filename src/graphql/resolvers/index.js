const { mergeResolvers } = require('@graphql-tools/merge');

const scalarResolvers = require('./scalars');
const userResolvers = require('./user');
const referenceResolvers = require('./reference');
const eventPermissionResolvers = require('./eventPermission');

const resolvers = mergeResolvers([
  scalarResolvers,
  userResolvers,
  referenceResolvers,
  eventPermissionResolvers,
]);

module.exports = resolvers;
