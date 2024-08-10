import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const openPage = async (url) => {
  try {
    const response = await api.post('/open', { url });
    return response.data;
  } catch (error) {
    console.error('Error opening page:', error);
    throw error;
  }
};

export const clickElement = async (operationTarget) => {
  try {
    const response = await api.post('/web/click_element', { operationTarget });
    return response.data;
  } catch (error) {
    console.error('Error clicking element:', error);
    throw error;
  }
};

export const getWindow = async (params) => {
  try {
    const response = await api.post('/get_wind', params);
    return response.data;
  } catch (error) {
    console.error('Error getting window:', error);
    throw error;
  }
};

export const clickElementWin = async (windowObject, operationTarget) => {
  try {
    const response = await api.post('/wind/click_element', {
      windowObject,
      operationTarget,
    });
    return response.data;
  } catch (error) {
    console.error('Error clicking element in window:', error);
    throw error;
  }
};

export const openExcel = async (params) => {
  try {
    const response = await api.post('/open_excel', params);
    return response.data;
  } catch (error) {
    console.error('Error opening Excel:', error);
    throw error;
  }
};

export const readExcel = async (params) => {
  try {
    const response = await api.post('/read_excel', params);
    return response.data;
  } catch (error) {
    console.error('Error reading Excel:', error);
    throw error;
  }
};

export const closeBrowser = async () => {
  try {
    const response = await api.post('/close_browser');
    return response.data;
  } catch (error) {
    console.error('Error closing browser:', error);
    throw error;
  }
};

// 辅助函数，用于获取窗口对象列表
export const getWindowObjects = async () => {
  try {
    const response = await api.get('/get_window_objects');
    return response.data;
  } catch (error) {
    console.error('Error getting window objects:', error);
    throw error;
  }
};

// 辅助函数，用于获取Excel对象列表
export const getExcelObjects = async () => {
  try {
    const response = await api.get('/get_excel_objects');
    return response.data;
  } catch (error) {
    console.error('Error getting Excel objects:', error);
    throw error;
  }
};
