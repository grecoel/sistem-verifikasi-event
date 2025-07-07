const UserAPI = require('./UserAPI');
const ReferenceAPI = require('./ReferenceAPI');
const EventPermissionAPI = require('./EventPermissionAPI');

const dataSources = (cache, db) => ({
  userAPI: new UserAPI({ cache, db }),
  referenceAPI: new ReferenceAPI({ cache, db }),
  eventPermissionAPI: new EventPermissionAPI({ cache, db }),
});

module.exports = dataSources;
