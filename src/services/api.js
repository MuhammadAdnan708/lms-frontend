import axios from 'axios';

// ✅ Local + Production Auto Switch
const API_URL =
  process.env.NODE_ENV === "production"
    ? "/api"
    : "http://localhost:5001/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 🔐 Request Interceptor (Token Add)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = 'Bearer ' + token;
  }
  return config;
});

// 🚨 Response Interceptor (Auto Logout on 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRequest =
      error.config?.url?.includes('/auth/login') ||
      error.config?.url?.includes('/auth/register');

    if (error.response?.status === 401 && !isAuthRequest) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      if (
        window.location.pathname !== '/login' &&
        window.location.pathname !== '/register'
      ) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  verifyEmail: (data) => api.post('/auth/verify-email', data),
  resendVerification: (data) => api.post('/auth/resend-verification', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  verifyResetCode: (data) => api.post('/auth/verify-reset-code', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

export const courseService = {
  getAll: (params) => api.get('/courses', { params }),
  getOne: (id) => api.get('/courses/' + id),
  create: (data) => api.post('/courses', data),
  update: (id, data) => api.put('/courses/' + id, data),
  delete: (id) => api.delete('/courses/' + id),
  getInstructor: () => api.get('/courses/instructor'),
  addLesson: (id, data) => api.post('/courses/' + id + '/lessons', data)
};

export const userService = {
  getAll: () => api.get('/users'),
  delete: (id) => api.delete('/users/' + id),
  getAnalytics: () => api.get('/users/analytics'),
  getPendingInstructors: () => api.get('/users/pending-instructors'),
  approveInstructor: (id) => api.put('/users/' + id + '/approve'),
  rejectInstructor: (id) => api.put('/users/' + id + '/reject')
};

export const enrollmentService = {
  enroll: (courseId) => api.post('/enrollments/enroll', { courseId }),
  getMyCourses: () => api.get('/enrollments/my-courses'),
  getAllEnrollments: () => api.get('/enrollments/all'),
  getProgress: (courseId) => api.get('/enrollments/' + courseId),
  updateProgress: (courseId, data) => api.put('/enrollments/' + courseId + '/progress', data)
};

export const contactService = {
  sendMessage: (data) => api.post('/contact/send', data),
  getAllMessages: () => api.get('/contact/all'),
  markAsRead: (id) => api.put('/contact/' + id + '/read'),
  deleteMessage: (id) => api.delete('/contact/' + id)
};

export const paymentService = {
  getConfig: () => api.get('/payment/config'),
  createPaymentIntent: (data) => api.post('/payment/create-payment-intent', data),
  verifyPayment: (data) => api.post('/payment/verify-payment', data)
};

export const reviewService = {
  addReview: (data) => api.post('/reviews', data),
  updateReview: (id, data) => api.put('/reviews/' + id, data),
  deleteReview: (id) => api.delete('/reviews/' + id),
  getCourseReviews: (courseId) => api.get('/reviews/course/' + courseId),
  getMyReview: (courseId) => api.get('/reviews/course/' + courseId + '/my-review')
};

export const categoryService = {
  getAll: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put('/categories/' + id, data),
  delete: (id) => api.delete('/categories/' + id)
};

export default api;