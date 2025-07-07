const referenceResolvers = {
  Query: {
    getProvinsi: async (_, __, { dataSources }) => {
      return await dataSources.referenceAPI.getProvinsi();
    },

    getKota: async (_, { provinsiId }, { dataSources }) => {
      return await dataSources.referenceAPI.getKota(provinsiId);
    },

    getKategoriAcara: async (_, { isActive }, { dataSources }) => {
      return await dataSources.referenceAPI.getKategoriAcara(isActive);
    },
  },
};

module.exports = referenceResolvers;
