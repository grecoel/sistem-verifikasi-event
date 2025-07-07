const { RESTDataSource } = require('@apollo/datasource-rest');

class EventPermissionAPI extends RESTDataSource {
  constructor(options) {
    super(options);
    this.baseURL = process.env.API_BASE_URL || 'http://localhost:3000/api/';
  }

  willSendRequest(path, request) {
    request.headers['Content-Type'] = 'application/json';
  }

  async getEventPermissionList(pagination, userId) {
    const params = new URLSearchParams();
    
    if (pagination) {
      if (pagination.take) params.append('take', pagination.take);
      if (pagination.skip) params.append('skip', pagination.skip);
      if (pagination.search) params.append('search', pagination.search);
      if (pagination.sort) params.append('sort', pagination.sort);
      if (pagination.sortDirection) params.append('sortDirection', pagination.sortDirection);
    }
    
    if (userId) params.append('user_id', userId);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.get(`event-permissions${query}`);
  }

  async getEventPermission(id, userId) {
    const params = userId ? `?user_id=${userId}` : '';
    return this.get(`event-permissions/${id}${params}`);
  }

  async getEventPermissionVerifikasiList(pagination) {
    const params = new URLSearchParams();
    
    if (pagination) {
      if (pagination.take) params.append('take', pagination.take);
      if (pagination.skip) params.append('skip', pagination.skip);
      if (pagination.search) params.append('search', pagination.search);
      if (pagination.sort) params.append('sort', pagination.sort);
      if (pagination.sortDirection) params.append('sortDirection', pagination.sortDirection);
    }
    
    // Add filter for unverified events
    params.append('verified', 'false');
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.get(`event-permissions/verifikasi${query}`);
  }

  async createEventPermission(eventData) {
    return this.post('event-permissions', eventData);
  }

  async updateEventPermission(id, eventData) {
    return this.patch(`event-permissions/${id}`, eventData);
  }

  async deleteEventPermission(id) {
    return this.delete(`event-permissions/${id}`);
  }

  async verifyEventPermission(id, verifiedBy) {
    return this.patch(`event-permissions/${id}/verify`, {
      verified_by: verifiedBy,
      verified_at: new Date().toISOString(),
    });
  }

  async getPengisiEventByEventId(eventId) {
    return this.get(`event-permissions/${eventId}/pengisi-event`);
  }

  async createPengisiEvent(eventId, pengisiData) {
    return this.post(`event-permissions/${eventId}/pengisi-event`, pengisiData);
  }

  async updatePengisiEvent(eventId, pengisiId, pengisiData) {
    return this.patch(`event-permissions/${eventId}/pengisi-event/${pengisiId}`, pengisiData);
  }

  async deletePengisiEvent(eventId, pengisiId) {
    return this.delete(`event-permissions/${eventId}/pengisi-event/${pengisiId}`);
  }
}

module.exports = EventPermissionAPI;
