import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL;
const EPR_API_URL = import.meta.env.VITE_SERVER;

const api = axios.create({
  baseURL: API_URL,
});

const eprApi = axios.create({
  baseURL: EPR_API_URL,
});

// Add interceptors for main API
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && 
        !error.config.url.includes('/auth/login') && 
        !error.config.url.includes('/auth/register')) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Club API methods
export const clubAPI = {
  getClubs: () => api.get('/clubs'),
  getClub: (id) => api.get(`/clubs/${id}`),
  createClub: (clubData) => api.post('/clubs', clubData),
  updateClub: (id, clubData) => api.put(`/clubs/${id}`, clubData),
  deleteClub: (id) => api.delete(`/clubs/${id}`)
};

// Member API methods
export const memberAPI = {
  getMembers: (params) => api.get('/members', { params }),
  getMember: (id) => api.get(`/members/${id}`),
  createMember: (memberData) => api.post('/members', memberData),
  updateMember: (id, memberData) => api.put(`/members/${id}`, memberData),
  deleteMember: (id) => api.delete(`/members/${id}`),
  getClubStats: (clubId) => api.get(`/members/stats/${clubId}`),
  checkStudentEligibility: (clubId, studentId) => 
    api.get(`/members/check-student/${clubId}/${studentId}`)
};

// EPR API methods (external)
export const eprAPI = {
  getClasses: () => eprApi.post('/getClass' , {session: '2025-2026'}),
  getSections: () => eprApi.post('/getSection' , {session: '2025-2026'}),
  getStudents: () => eprApi.post('/fetchAdmittedStudents', {session: '2025-2026'})
};

export default api;