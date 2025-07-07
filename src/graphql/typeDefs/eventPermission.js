const { gql } = require('graphql-tag');

const eventPermissionTypeDefs = gql`
  type EventPermission {
    id: ID!
    nama_acara: String!
    penyelenggara: String!
    jumlah_peserta: Int!
    tanggal_mulai: String! # YYYY-MM-DD
    tanggal_selesai: String! # YYYY-MM-DD
    jam_mulai: String # HH:MM
    jam_selesai: String # HH:MM
    lokasi: String!
    provinsi_id: Int!
    kota_id: Int!
    kategori_acara_id: Int
    biaya: String
    deskripsi: String
    dokumentasi_url: String
    user_id: ID!
    # Verification fields
    verified_at: DateTime
    verified_by: String # Username of verifikator
    created_at: DateTime!
    updated_at: DateTime!
    # Relationships
    provinsi: Provinsi
    kota: Kota
    kategoriAcara: KategoriAcara
    pengisiEvent: [PengisiEvent!]!
  }

  type PengisiEvent {
    id: ID!
    event_permission_id: ID!
    nama_pengisi: String!
    judul_materi: String!
    created_at: DateTime!
    updated_at: DateTime!
  }

  input EventPermissionInput {
    nama_acara: String!
    penyelenggara: String!
    jumlah_peserta: Int!
    tanggal_mulai: String!
    tanggal_selesai: String!
    jam_mulai: String
    jam_selesai: String
    lokasi: String!
    provinsi_id: Int!
    kota_id: Int!
    kategori_acara_id: Int
    biaya: String
    deskripsi: String
    pengisi_event: [PengisiEventInput!]
  }

  input PengisiEventInput {
    nama_pengisi: String!
    judul_materi: String!
  }

  input PaginationInput {
    take: Int = 10
    skip: Int = 0
    search: String
    sort: String = "created_at"
    sortDirection: String = "desc"
  }

  type EventPermissionListResponse {
    data: [EventPermission!]!
    total: Int!
    totalFiltered: Int!
  }

  extend type Query {
    # Public queries (no auth required)
    getEventPermissionList(pagination: PaginationInput, user_id: String): EventPermissionListResponse!
    getEventPermission(id: ID!, user_id: String): EventPermission
    # Protected queries (auth required)
    getEventPermissionVerifikasiList(pagination: PaginationInput): EventPermissionListResponse!
  }

  extend type Mutation {
    # Operator only mutations (requires operator role + ownership verification)
    createEventPermission(input: EventPermissionInput!): EventPermission!
    updateEventPermission(id: ID!, input: EventPermissionInput!): EventPermission!
    deleteEventPermission(id: ID!): Boolean!
    # Verifikator only mutations (requires verifikator role + pairing verification)
    verifyEventPermission(id: ID!): EventPermission!
  }
`;

module.exports = eventPermissionTypeDefs;
