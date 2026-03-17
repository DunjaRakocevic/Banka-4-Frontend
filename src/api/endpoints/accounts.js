import api from '../client';

export const accountsApi = {
  searchClient: (q) => api.get('/clients/search', { params: { q } }),

  createClient: (data) => api.post('/clients', data),

  createAccount: (data) => api.post('/accounts', data),
};
