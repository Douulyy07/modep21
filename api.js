import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

// Instance de base
const apiInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Récupération du CSRF avant les requêtes sensibles
apiInstance.interceptors.request.use(
  async (config) => {
    const method = config.method?.toLowerCase();
    if (['post', 'put', 'patch', 'delete'].includes(method)) {
      try {
        const csrfRes = await axios.get(`${API_BASE_URL}/auth/csrf/`, {
          withCredentials: true,
        });
        const token = csrfRes.data.csrfToken;
        config.headers['X-CSRFToken'] = token;
      } catch (err) {
        console.error('Erreur CSRF:', err);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Adherents API
export const adherentsAPI = {
  getAll: (params = {}) => apiInstance.get('/adherents/', { params }),
  getById: (id) => apiInstance.get(`/adherents/${id}/`),
  create: (data) => apiInstance.post('/adherents/', data),
  update: (id, data) => apiInstance.put(`/adherents/${id}/`, data),
  delete: (id) => apiInstance.delete(`/adherents/${id}/`),
};

// Cotisations API
export const cotisationsAPI = {
  getAll: (params = {}) => apiInstance.get('/cotisations/', { params }),
  getById: (id) => apiInstance.get(`/cotisations/${id}/`),
  create: (data) => apiInstance.post('/cotisations/', data),
  update: (id, data) => apiInstance.put(`/cotisations/${id}/`, data),
  patch: (id, data) => apiInstance.patch(`/cotisations/${id}/`, data),
  delete: (id) => apiInstance.delete(`/cotisations/${id}/`),
};

// Soins API
export const soinsAPI = {
  getAll: (params = {}) => apiInstance.get('/soins/', { params }),
  getById: (id) => apiInstance.get(`/soins/${id}/`),
  create: (data) => apiInstance.post('/soins/', data),
  update: (id, data) => apiInstance.put(`/soins/${id}/`, data),
  delete: (id) => apiInstance.delete(`/soins/${id}/`),
};

export default apiInstance;