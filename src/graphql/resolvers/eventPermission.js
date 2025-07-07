const { GraphQLError } = require('graphql');

const eventPermissionResolvers = {
  Query: {
    getEventPermissionList: async (_, { pagination, user_id }, { dataSources }) => {
      return await dataSources.eventPermissionAPI.getEventPermissionList(pagination, user_id);
    },

    getEventPermission: async (_, { id, user_id }, { dataSources }) => {
      return await dataSources.eventPermissionAPI.getEventPermission(id, user_id);
    },

    getEventPermissionVerifikasiList: async (_, { pagination }, { user, dataSources }) => {
      if (!user) {
        throw new GraphQLError('You must be logged in to perform this action', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      if (user.role !== 'VERIFIKATOR') {
        throw new GraphQLError('Only verifikators can access this resource', {
          extensions: { code: 'FORBIDDEN' }
        });
      }

      return await dataSources.eventPermissionAPI.getEventPermissionVerifikasiList(pagination);
    },
  },

  Mutation: {
    createEventPermission: async (_, { input }, { user, dataSources }) => {
      if (!user) {
        throw new GraphQLError('You must be logged in to perform this action', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      if (user.role !== 'OPERATOR') {
        throw new GraphQLError('Only operators can create event permissions', {
          extensions: { code: 'FORBIDDEN' }
        });
      }

      return await dataSources.eventPermissionAPI.createEventPermission({
        ...input,
        user_id: user.id,
      });
    },

    updateEventPermission: async (_, { id, input }, { user, dataSources }) => {
      if (!user) {
        throw new GraphQLError('You must be logged in to perform this action', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      if (user.role !== 'OPERATOR') {
        throw new GraphQLError('Only operators can update event permissions', {
          extensions: { code: 'FORBIDDEN' }
        });
      }

      // Check if user owns this event permission
      const eventPermission = await dataSources.eventPermissionAPI.getEventPermission(id);
      if (!eventPermission || eventPermission.user_id !== user.id) {
        throw new GraphQLError('You can only update your own event permissions', {
          extensions: { code: 'FORBIDDEN' }
        });
      }

      return await dataSources.eventPermissionAPI.updateEventPermission(id, input);
    },

    deleteEventPermission: async (_, { id }, { user, dataSources }) => {
      if (!user) {
        throw new GraphQLError('You must be logged in to perform this action', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      if (user.role !== 'OPERATOR') {
        throw new GraphQLError('Only operators can delete event permissions', {
          extensions: { code: 'FORBIDDEN' }
        });
      }

      // Check if user owns this event permission
      const eventPermission = await dataSources.eventPermissionAPI.getEventPermission(id);
      if (!eventPermission || eventPermission.user_id !== user.id) {
        throw new GraphQLError('You can only delete your own event permissions', {
          extensions: { code: 'FORBIDDEN' }
        });
      }

      return await dataSources.eventPermissionAPI.deleteEventPermission(id);
    },

    verifyEventPermission: async (_, { id }, { user, dataSources }) => {
      if (!user) {
        throw new GraphQLError('You must be logged in to perform this action', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      if (user.role !== 'VERIFIKATOR') {
        throw new GraphQLError('Only verifikators can verify event permissions', {
          extensions: { code: 'FORBIDDEN' }
        });
      }

      return await dataSources.eventPermissionAPI.verifyEventPermission(id, user.username);
    },
  },

  EventPermission: {
    provinsi: async (parent, _, { dataSources }) => {
      if (parent.provinsi_id) {
        return await dataSources.referenceAPI.getProvinsiById(parent.provinsi_id);
      }
      return null;
    },

    kota: async (parent, _, { dataSources }) => {
      if (parent.kota_id) {
        return await dataSources.referenceAPI.getKotaById(parent.kota_id);
      }
      return null;
    },

    kategoriAcara: async (parent, _, { dataSources }) => {
      if (parent.kategori_acara_id) {
        return await dataSources.referenceAPI.getKategoriAcaraById(parent.kategori_acara_id);
      }
      return null;
    },

    pengisiEvent: async (parent, _, { dataSources }) => {
      return await dataSources.eventPermissionAPI.getPengisiEventByEventId(parent.id);
    },
  },
};

module.exports = eventPermissionResolvers;
