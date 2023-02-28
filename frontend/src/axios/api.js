import axios from 'axios';

const api = axios.create();

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      error.response.status === 401 &&
      (error.response.data.errorCode === 'SESSION_EXPIRED' ||
        error.response.data.errorCode === 'INVALID_TOKEN')
    ) {
      // Redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
