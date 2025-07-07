const { db } = require('./index.js');
const { sql } = require('drizzle-orm');

async function createDatabase() {
  console.log('Creating database if not exists...');
  
  try {
    // Create database
    await db.execute(sql`CREATE DATABASE IF NOT EXISTS event_permission_system`);
    await db.execute(sql`USE event_permission_system`);
    
    console.log('Database created successfully!');
  } catch (error) {
    console.error('Error creating database:', error);
    throw error;
  }
}

async function runMigrations() {
  console.log('Running database migrations...');
  
  try {
    // Users table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(128) PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('operator', 'verifikator') NOT NULL,
        kode_unit VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
        INDEX idx_username (username),
        INDEX idx_kode_unit (kode_unit),
        INDEX idx_role (role)
      )
    `);

    // Provinsi table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS provinsi (
        id INT PRIMARY KEY AUTO_INCREMENT,
        nama VARCHAR(100) NOT NULL,
        kode VARCHAR(10) NOT NULL,
        INDEX idx_nama (nama)
      )
    `);

    // Kota table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS kota (
        id INT PRIMARY KEY AUTO_INCREMENT,
        provinsi_id INT NOT NULL,
        nama VARCHAR(100) NOT NULL,
        kode VARCHAR(10) NOT NULL,
        FOREIGN KEY (provinsi_id) REFERENCES provinsi(id) ON DELETE CASCADE,
        INDEX idx_provinsi_id (provinsi_id),
        INDEX idx_nama (nama)
      )
    `);

    // Kategori Acara table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS kategori_acara (
        id INT PRIMARY KEY AUTO_INCREMENT,
        nama VARCHAR(100) NOT NULL,
        kode VARCHAR(20) NOT NULL,
        deskripsi TEXT,
        is_active BOOLEAN DEFAULT TRUE NOT NULL,
        INDEX idx_nama (nama),
        INDEX idx_is_active (is_active)
      )
    `);

    // Event Permissions table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS event_permissions (
        id VARCHAR(128) PRIMARY KEY,
        nama_acara VARCHAR(200) NOT NULL,
        penyelenggara VARCHAR(200) NOT NULL,
        jumlah_peserta INT NOT NULL CHECK (jumlah_peserta >= 1),
        tanggal_mulai VARCHAR(10) NOT NULL,
        tanggal_selesai VARCHAR(10) NOT NULL,
        jam_mulai VARCHAR(5),
        jam_selesai VARCHAR(5),
        lokasi TEXT NOT NULL,
        provinsi_id INT NOT NULL,
        kota_id INT NOT NULL,
        kategori_acara_id INT,
        biaya VARCHAR(100),
        deskripsi TEXT,
        dokumentasi_url VARCHAR(500),
        user_id VARCHAR(128) NOT NULL,
        verified_at DATETIME,
        verified_by VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (provinsi_id) REFERENCES provinsi(id),
        FOREIGN KEY (kota_id) REFERENCES kota(id),
        FOREIGN KEY (kategori_acara_id) REFERENCES kategori_acara(id),
        INDEX idx_user_id (user_id),
        INDEX idx_verified_at (verified_at),
        INDEX idx_created_at (created_at),
        INDEX idx_nama_acara (nama_acara),
        INDEX idx_tanggal_mulai (tanggal_mulai),
        INDEX idx_provinsi_kota (provinsi_id, kota_id),
        CONSTRAINT chk_tanggal_valid CHECK (tanggal_selesai >= tanggal_mulai)
      )
    `);

    // Pengisi Event table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS pengisi_event (
        id INT PRIMARY KEY AUTO_INCREMENT,
        event_permission_id VARCHAR(128) NOT NULL,
        nama_pengisi VARCHAR(200) NOT NULL,
        judul_materi VARCHAR(300) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
        FOREIGN KEY (event_permission_id) REFERENCES event_permissions(id) ON DELETE CASCADE,
        INDEX idx_event_permission_id (event_permission_id)
      )
    `);

    console.log('Database migrations completed successfully!');
  } catch (error) {
    console.error('Error running migrations:', error);
    throw error;
  }
}

// Main function to run migrations
async function main() {
  console.log('Setting up database...');
  
  try {
    await createDatabase();
    await runMigrations();
    console.log('Database setup completed!');
    process.exit(0);
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main();
}

module.exports = { createDatabase, runMigrations };