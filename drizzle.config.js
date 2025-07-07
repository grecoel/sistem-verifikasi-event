const { defineConfig } = require('drizzle-kit');

module.exports = defineConfig({
  schema: './src/db/schema/*.js',
  out: './src/db/migrations',
  dialect: 'mysql',
  dbCredentials: {
    uri: process.env.DATABASE_URL || 'mysql://root:password@localhost:3306/event_permission_system',
  },
  verbose: true,
  strict: true,
});
