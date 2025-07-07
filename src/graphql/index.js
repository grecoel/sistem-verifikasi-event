const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');

// Import koneksi database Drizzle
const { db } = require('../db');

const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const dataSources = require('./dataSources');
const { getUser } = require('./middleware/auth');

async function startApolloServer() {
  const server = new ApolloServer({ 
    typeDefs, 
    resolvers,
    formatError: (err) => {
      // Log error untuk debugging
      console.error('GraphQL Error:', err);
      
      // Return response yang sudah diformat
      return {
        message: err.message,
        code: err.extensions?.code || 'INTERNAL_ERROR',
        path: err.path,
        locations: err.locations,
      };
    },
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: process.env.PORT || 4000 },
    context: async ({ req }) => {
      const { cache } = server;
      const user = await getUser(req);

      return {
        user,
        db, // Tambahkan instance database ke context
        dataSources: dataSources(cache, db),
      };
    },
  });

  console.log(`
    Server berjalan
    Query di ${url}
  `);
}

startApolloServer();