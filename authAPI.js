import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// ✅ Interceptor sur `api`
api.interceptors.request.use(
  async (config) => {
    if (['post', 'put', 'patch', 'delete'].includes(config.method)) {
      try {
        const csrfResponse = await axios.get(`${API_BASE_URL}/auth/csrf/`, {
          withCredentials: true
        });
        const csrfToken = csrfResponse.data.csrfToken;
        config.headers['X-CSRFToken'] = csrfToken;
      } catch (error) {
        console.error('Error getting CSRF token:', error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ✅ Export APIs
export const adherentsAPI = {
  getAll: () => api.get('/api/adherents/'),
  get: (id) => api.get(`/api/adherents/${id}/`),
  create: (data) => api.post('/api/adherents/', data),
  update: (id, data) => api.put(`/api/adherents/${id}/`, data),
  delete: (id) => api.delete(`/api/adherents/${id}/`),
};

export const cotisationsAPI = {
  getAll: () => api.get('/api/cotisations/'),
  get: (id) => api.get(`/api/cotisations/${id}/`),
  create: (data) => api.post('/api/cotisations/', data),
  update: (id, data) => api.put(`/api/cotisations/${id}/`, data),
  delete: (id) => api.delete(`/api/cotisations/${id}/`),
};

export const soinsAPI = {
  getAll: () => api.get('/api/soins/'),
  get: (id) => api.get(`/api/soins/${id}/`),
  create: (data) => api.post('/api/soins/', data),
  update: (id, data) => api.put(`/api/soins/${id}/`, data),
  delete: (id) => api.delete(`/api/soins/${id}/`),
};

// ✅ Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login/', credentials),
  signup: (userData) => api.post('/auth/signup/', userData),
  logout: () => api.post('/auth/logout/'),
  getUser: () => api.get('/auth/user/'),
  getCsrfToken: () => api.get('/auth/csrf/'),
};

export default api;
