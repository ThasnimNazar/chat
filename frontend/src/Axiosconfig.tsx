import axios from 'axios';

// instance for unauthenticated requests
const publicApi = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true

});

// instance for authenticated requests
const privateApi = axios.create({
  withCredentials: true // Ensure cookies are sent with every request
});

privateApi.interceptors.request.use(
  (config) => {
    const role = localStorage.getItem('role');

    if (role === 'user') {
      config.baseURL = 'http://localhost:5000/api/user';
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// privateApi.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     if (error.response) {
//       const { status } = error.response;
//       if (status === 401) {
//         console.error('Unauthorized request - redirecting to login');
//         window.location.href = '/login';
//       } else if (status === 403) {
//         console.error('Forbidden request - access denied');
//       }
//     } else {
//       console.error('Network error or other issue');
//     }
//     return Promise.reject(error);
//   }
// );

export { publicApi, privateApi };
