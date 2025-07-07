const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { GraphQLError } = require('graphql');

const userResolvers = {
  Query: {
    me: async (_, __, { user, dataSources }) => {
      if (!user) {
        throw new GraphQLError('You must be logged in to perform this action', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }
      return await dataSources.userAPI.getUser(user.id);
    },
  },

  Mutation: {
    login: async (_, { input }, { dataSources }) => {
      try {
        const { username, password } = input;
        
        // Get user from database
        const user = await dataSources.userAPI.getUserByUsername(username);
        
        if (!user) {
          throw new GraphQLError('Invalid credentials', {
            extensions: { code: 'AUTHENTICATION_ERROR' }
          });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
          throw new GraphQLError('Invalid credentials', {
            extensions: { code: 'AUTHENTICATION_ERROR' }
          });
        }

        // Generate JWT token
        const token = jwt.sign(
          { id: user.id, username: user.username, role: user.role },
          process.env.JWT_SECRET || 'your-secret-key',
          { expiresIn: '24h' }
        );

        return {
          user: {
            id: user.id,
            username: user.username,
            role: user.role,
            kode_unit: user.kode_unit,
            created_at: user.created_at,
            updated_at: user.updated_at,
          },
          token,
        };
      } catch (error) {
        throw new GraphQLError(error.message || 'Login failed', {
          extensions: { code: 'AUTHENTICATION_ERROR' }
        });
      }
    },
  },
};

module.exports = userResolvers;
