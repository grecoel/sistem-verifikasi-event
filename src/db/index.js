const { drizzle } = require('drizzle-orm/mysql2');
const mysql = require('mysql2/promise');
const schema = require('./schema/index.js');

// membuat koneksi
const connection = mysql.createPool({
  uri: process.env.DATABASE_URL || 'mysql://root:Gegecp2005!123@localhost:3307/event_permission_system',
  multipleStatements: true,
});

// membuat database instance
const db = drizzle(connection, { schema, mode: 'default' });

module.exports = { schema, db };
