const { 
  mysqlTable, 
  varchar, 
  timestamp, 
  int, 
  text, 
  datetime,
  boolean,
  mysqlEnum
} = require('drizzle-orm/mysql-core');
const { createId } = require('@paralleldrive/cuid2');

// tabel user untuk autentikasi
const users = mysqlTable('users', {
    id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
    username: varchar('username', { length: 50 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
    role: mysqlEnum('role', ['operator', 'verifikator']).notNull(),
    kode_unit: varchar('kode_unit', { length: 50 }).notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// table reference entities
const provinsi = mysqlTable('provinsi', {
    id: int('id').primaryKey().autoincrement(),
    nama: varchar('nama', { length: 100 }).notNull(),
    kode: varchar('kode', { length: 10 }).notNull(),
});

const kota = mysqlTable('kota', {
    id: int('id').primaryKey().autoincrement(),
    provinsi_id: int('provinsi_id').notNull(),
    nama: varchar('nama', { length: 100 }).notNull(),
    kode: varchar('kode', { length: 10 }).notNull(),
});

const kategori_acara = mysqlTable('kategori_acara', {
    id: int('id').primaryKey().autoincrement(),
    nama: varchar('nama', { length: 100 }).notNull(),
    kode: varchar('kode', { length: 20 }).notNull(),
    deskripsi: text('deskripsi'),
    is_active: boolean('is_active').default(true).notNull(),
});

// tabel event permission
const event_permissions = mysqlTable('event_permissions', {
    id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
    nama_acara: varchar('nama_acara', { length: 200 }).notNull(),
    penyelenggara: varchar('penyelenggara', { length: 200 }).notNull(),
    jumlah_peserta: int('jumlah_peserta').notNull(),
    tanggal_mulai: varchar('tanggal_mulai', { length: 10 }).notNull(), // YYYY-MM-DD
    tanggal_selesai: varchar('tanggal_selesai', { length: 10 }).notNull(), // YYYY-MM-DD
    jam_mulai: varchar('jam_mulai', { length: 5 }), // HH:MM
    jam_selesai: varchar('jam_selesai', { length: 5 }), // HH:MM
    lokasi: text('lokasi').notNull(),
    provinsi_id: int('provinsi_id').notNull(),
    kota_id: int('kota_id').notNull(),
    kategori_acara_id: int('kategori_acara_id'),
    biaya: varchar('biaya', { length: 100 }),
    deskripsi: text('deskripsi'),
    dokumentasi_url: varchar('dokumentasi_url', { length: 500 }),
    user_id: varchar('user_id', { length: 128 }).notNull(),
    // bagian verifikasi 
    verified_at: datetime('verified_at'),
    verified_by: varchar('verified_by', { length: 50 }),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// pengisi event
const pengisi_event = mysqlTable('pengisi_event', {
    id: int('id').primaryKey().autoincrement(),
    event_permission_id: varchar('event_permission_id', { length: 128 }).notNull(),
    nama_pengisi: varchar('nama_pengisi', { length: 200 }).notNull(),
    judul_materi: varchar('judul_materi', { length: 300 }).notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

module.exports = { users, provinsi, kota, kategori_acara, event_permissions, pengisi_event };