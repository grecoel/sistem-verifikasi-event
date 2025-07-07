const baseTypeDefs = require('./base');
const scalarTypeDefs = require('./scalars');
const userTypeDefs = require('./user');
const referenceTypeDefs = require('./reference');
const eventPermissionTypeDefs = require('./eventPermission');

module.exports = [
  baseTypeDefs,
  scalarTypeDefs,
  userTypeDefs,
  referenceTypeDefs,
  eventPermissionTypeDefs,
];
