const { gql } = require('graphql-tag');

const referenceTypeDefs = gql`
  type Provinsi {
    id: ID!
    nama: String!
    kode: String!
  }

  type Kota {
    id: ID!
    provinsi_id: Int!
    nama: String!
    kode: String!
  }

  type KategoriAcara {
    id: ID!
    nama: String!
    kode: String!
    deskripsi: String
    is_active: Boolean!
  }

  extend type Query {
    getProvinsi: [Provinsi!]!
    getKota(provinsiId: Int!): [Kota!]!
    getKategoriAcara(isActive: Boolean): [KategoriAcara!]!
  }
`;

module.exports = referenceTypeDefs;
