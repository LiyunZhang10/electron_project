// src/services/apiService.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const openPage = (url) => {
  return apiClient.post('/open', { url });
};

export const clickElement = (selector) => {
  return apiClient.post('/click', { selector });
};

export const closeBrowser = () => {
  return apiClient.post('/close');
};

export const openExcel = (filePath) => {
  return apiClient.post('/open_excel', { filePath });
};

export const readExcel = (sheetName) => {
  return apiClient.post('/read_excel', { sheetName });
};
