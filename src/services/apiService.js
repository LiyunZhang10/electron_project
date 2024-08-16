import axios from 'axios';
import { reactive } from 'vue';

export const openPage = async (urls) => {
  const url = reactive({
    url: ""
  })
  url.url = urls
  try {
    const response = await axios({
      method: 'post',
      url: '/api/web_auto/open_web',
      data: url,
      headers: {
        'Content-Type': 'application/json',
      }
    })
    console.log(response)
  } catch (error) {
    console.error('Error opening page:', error);
    throw error;
  }
};

export const clickElement = async (operationTarget) => {
  const target = reactive({
    loc: ""
  })
  target.loc = operationTarget
  try {
    const response = await axios({
      method: 'post',
      url: '/api/web_auto/click_element',
      data: target,
      headers: {
        'Content-Type': 'application/json',
      }
    })
    return response.data;
  } catch (error) {
    console.error('Error clicking element:', error);
    throw error;
  }
};

export const getWindow = async (params) => {
  console.log(params)
  const target = reactive({
    method: "",
    loc: ""
  })
  target.method = params.getWindowMethod;
  target.loc = params.windowTitle
  console.log(target)
  try {
    const response = await axios({
      method: 'post',
      url: '/api/desk_auto/get_window',
      data: target,
      headers: {
        'Content-Type': 'application/json',
      }
    })
    console.log("response", response)
    return response.data;
  } catch (error) {
    console.error('Error getting window:', error);
    throw error;
  }
};

export const clickElementWin = async (formData) => {
  try {
    const response = await axios({
      method: 'post',
      url: '/api/desk_auto/click_element',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('response', response);
    return response.data;
  } catch (error) {
    console.error('Error clicking element:', error);
    throw error;
  }
};

export const openExcel = async (params) => {
  const target = reactive({
    method: '',
    file_path: '',
    driver_method: '',
  });
  target.method = params.openMethod;
  target.file_path = params.excelFilePath;
  target.driver_method = params.driverType;
  try {
    const response = await axios({
      method: 'post',
      url: '/api/excel_wps/open_excel',
      data: target,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error opening Excel:', error);
    throw error;
  }
};

export const readExcel = async (params) => {
  console.log(params)
  if (params.readMethod === 'cell_content') {
    var target = reactive({
      read_method: '',
      sheet_name: '',
      args: '',
    });
    target.read_method = params.readMethod;
    target.sheet_name = params.sheetName;
    target.args = {
      [params.cellRowNumber]: params.cellColNumber,
    };
  } else if (params.readMethod === 'row_content') {
    var target = reactive({
      read_method: '',
      sheet_name: '',
      args: '',
    });
    target.read_method = params.readMethod;
    target.sheet_name = params.sheetName;
    target.args = {
      'row': params.rowNumber,
    };
  } else if (params.readMethod === 'col_content') {
    var target = reactive({
      read_method: '',
      sheet_name: '',
      args: '',
    });
    target.read_method = params.readMethod;
    target.sheet_name = params.sheetName;
    target.args = {
      'col': params.colNumber
    }
  } else if (params.readMethod === 'area_content') {
    var target = reactive({
      read_method: '',
      sheet_name: '',
      args: '',
    });
    target.read_method = params.readMethod;
    target.sheet_name = params.sheetName;
    target.args = {
      [params.firstRowNumber]: params.firstColNumber,
      [params.lastRowNumber]: params.lastColNumber,
    };
  } else if (params.readMethod === 'used_area_content') {
    var target = reactive({
      read_method: '',
      sheet_name: '',
    });
    target.read_method = params.readMethod;
    target.sheet_name = params.sheetName;
  }
  console.log(target)
  try {
    const response = await axios({
      method: 'post',
      url: '/api/excel_wps/read_excel',
      data: target,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('response', response);
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
