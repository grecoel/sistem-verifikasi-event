const { RESTDataSource } = require('@apollo/datasource-rest');

class UserAPI extends RESTDataSource {
  constructor(options) {
    super(options);
    this.baseURL = process.env.API_BASE_URL || 'http://localhost:3000/api/';
  }

  willSendRequest(path, request) {
    // Add any common headers or authentication if needed
    request.headers['Content-Type'] = 'application/json';
  }

  async getUser(id) {
    return this.get(`users/${id}`);
  }

  async getUserByUsername(username) {
    return this.get(`users/by-username/${username}`);
  }

  async createUser(userData) {
    return this.post('users', userData);
  }

  async updateUser(id, userData) {
    return this.patch(`users/${id}`, userData);
  }

  async deleteUser(id) {
    return this.delete(`users/${id}`);
  }
}

module.exports = UserAPI;
