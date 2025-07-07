import { db } from '../db/index.js';
import { users, provinsi, kota, kategori_acara } from '../db/schema/index.js';
import { hashPassword } from '../utils/auth.js';

async function seed() {
  console.log('Starting database seeding...');

  try {
    // Seed Provinsi
    console.log('Seeding Provinsi...');
    await db.insert(provinsi).values([
      { id: 1, nama: 'DKI Jakarta', kode: 'JKT' },
      { id: 2, nama: 'Jawa Barat', kode: 'JB' },
      { id: 3, nama: 'Jawa Tengah', kode: 'JT' },
      { id: 4, nama: 'Jawa Timur', kode: 'JI' },
      { id: 5, nama: 'Bali', kode: 'BA' },
    ]);

    // Seed Kota
    console.log('Seeding Kota...');
    await db.insert(kota).values([
      // Jakarta
      { id: 1, provinsi_id: 1, nama: 'Jakarta Pusat', kode: 'JP' },
      { id: 2, provinsi_id: 1, nama: 'Jakarta Utara', kode: 'JU' },
      { id: 3, provinsi_id: 1, nama: 'Jakarta Selatan', kode: 'JS' },
      // Jawa Barat
      { id: 4, provinsi_id: 2, nama: 'Bandung', kode: 'BDG' },
      { id: 5, provinsi_id: 2, nama: 'Bogor', kode: 'BGR' },
      { id: 6, provinsi_id: 2, nama: 'Bekasi', kode: 'BKS' },
      // Jawa Tengah
      { id: 7, provinsi_id: 3, nama: 'Semarang', kode: 'SMG' },
      { id: 8, provinsi_id: 3, nama: 'Surakarta', kode: 'SKA' },
      { id: 9, provinsi_id: 3, nama: 'Yogyakarta', kode: 'YGY' },
      // Jawa Timur
      { id: 10, provinsi_id: 4, nama: 'Surabaya', kode: 'SBY' },
      { id: 11, provinsi_id: 4, nama: 'Malang', kode: 'MLG' },
      // Bali
      { id: 12, provinsi_id: 5, nama: 'Denpasar', kode: 'DPS' },
      { id: 13, provinsi_id: 5, nama: 'Ubud', kode: 'UBD' },
    ]);

    // Seed Kategori Acara
    console.log('Seeding Kategori Acara...');
    await db.insert(kategori_acara).values([
      { id: 1, nama: 'Seminar', kode: 'SEM', deskripsi: 'Acara seminar dan presentasi', is_active: true },
      { id: 2, nama: 'Workshop', kode: 'WS', deskripsi: 'Acara workshop dan pelatihan', is_active: true },
      { id: 3, nama: 'Konferensi', kode: 'CONF', deskripsi: 'Acara konferensi dan simposium', is_active: true },
      { id: 4, nama: 'Pameran', kode: 'EXPO', deskripsi: 'Acara pameran dan exhibition', is_active: true },
      { id: 5, nama: 'Kompetisi', kode: 'COMP', deskripsi: 'Acara kompetisi dan lomba', is_active: true },
      { id: 6, nama: 'Festival', kode: 'FEST', deskripsi: 'Acara festival dan perayaan', is_active: true },
      { id: 7, nama: 'Rapat', kode: 'MEET', deskripsi: 'Acara rapat dan pertemuan', is_active: false },
    ]);

    // Seed Users
    console.log('👥 Seeding Users...');
    const hashedPassword = await hashPassword('password123');
    
    await db.insert(users).values([
      // Operators - Jakarta Unit
      {
        username: 'operator_jakarta_1',
        password: hashedPassword,
        role: 'operator',
        kode_unit: 'JAKARTA_01',
      },
      {
        username: 'operator_jakarta_2',
        password: hashedPassword,
        role: 'operator',
        kode_unit: 'JAKARTA_01',
      },
      // Verifikator - Jakarta Unit
      {
        username: 'verifikator_jakarta',
        password: hashedPassword,
        role: 'verifikator',
        kode_unit: 'JAKARTA_01',
      },
      // Operators - Bandung Unit
      {
        username: 'operator_bandung_1',
        password: hashedPassword,
        role: 'operator',
        kode_unit: 'BANDUNG_02',
      },
      {
        username: 'operator_bandung_2',
        password: hashedPassword,
        role: 'operator',
        kode_unit: 'BANDUNG_02',
      },
      // Verifikator - Bandung Unit
      {
        username: 'verifikator_bandung',
        password: hashedPassword,
        role: 'verifikator',
        kode_unit: 'BANDUNG_02',
      },
      // Operators - Semarang Unit
      {
        username: 'operator_semarang',
        password: hashedPassword,
        role: 'operator',
        kode_unit: 'SEMARANG_03',
      },
      // Verifikator - Semarang Unit
      {
        username: 'verifikator_semarang',
        password: hashedPassword,
        role: 'verifikator',
        kode_unit: 'SEMARANG_03',
      },
    ]);

    console.log('Database seeding completed successfully!');
    console.log('');
    console.log(' Test Accounts:');
    console.log('');
    console.log(' JAKARTA_01 Unit:');
    console.log('   Operator: operator_jakarta_1 / password123');
    console.log('   Operator: operator_jakarta_2 / password123');
    console.log('   Verifikator: verifikator_jakarta / password123');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (process.argv[1].endsWith('seed.js')) {
  await seed();
  process.exit(0);
}

export { seed };
