import axios from 'axios';

const API_BASE_URL = 'http://3.107.47.218:8090/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token request if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// api methods
export const apiService = {
  saveAuthData: (token, roles) => {
    localStorage.setItem('token', token);
    localStorage.setItem('roles', JSON.stringify(roles));
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
  },

  hasRole(role) {
    const roles = localStorage.getItem('roles');
    return roles ? JSON.parse(roles).includes(role) : false;
  },

  isAuthenticated: () => {
    return localStorage.getItem('token') !== null;
  },

  isAdmin() {
    return this.hasRole('ADMIN');
  },

  isCustomer() {
    return this.hasRole('CUSTOMER');
  },

  isAuditor() {
    return this.hasRole('AUDITOR');
  },

  login: (body) => {
    return api.post('/auth/login', body);
  },

  register: (body) => {
    return api.post('/auth/register', body);
  },

  forgetPassword: (body) => {
    return api.post('/auth/forgot-password', body);
  },

  resetPassword: (body) => {
    return api.post('/auth/reset-password', body);
  },

  getMyProfile: () => {
    return api.get('/users/me');
  },

  updatePassword: (oldPassword, newPassword) => {
    return api.put('/users/update-password', { oldPassword, newPassword });
  },

  uploadProfilePicture: (file) => {
    const formData = new FormData();
    formData.append('file', file);

    return api.put('/users/profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getMyAccounts: () => {
    return api.get('/accounts/me');
  },

  makeTransfer: (transferData) => {
    return api.post('/transactions', transferData);
  },

  getTransactions: (accountNumber, page = 0, size = 10) => {
    return api.get(`/transactions/${accountNumber}?page=${page}&size=${size}`);
  },

  getSystemTotals: () => {
    return api.get('/audit/totals');
  },

  findUserByEmail: (email) => {
    return api.get(`/audit/users?email=${email}`);
  },

  findAccountByAccountNumber: (accountNumber) => {
    return api.get(`/audit/accounts?accountNumber=${accountNumber}`);
  },

  getTransactionsByAccountNumber: (accountNumber) => {
    return api.get(
      `/audit/transactions/by-account?accountNumber=${accountNumber}`,
    );
  },

  getTransactionById: (transactionId) => {
    return api.get(`/audit/transaction/by-id?id=${transactionId}`);
  },
};

export default api;
