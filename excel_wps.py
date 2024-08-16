import pythoncom
from flask import Blueprint, request, g
from rpa_project.excel_wps.base_component import BaseComponent

excel_wps_ob = Blueprint('excel_wps',__name__,url_prefix='/excel_wps')

method = None
file_path = None
driver_method = None
excel_object = None
@excel_wps_ob.route('open_excel',methods=['POST'])
def open_excel():
    global excel_object,method,file_path,driver_method
    method = request.get_json()['method']
    file_path = request.get_json()['file_path']
    driver_method = request.get_json()['driver_method']
    excel_instance = BaseComponent().open_or_create_excel(method,file_path,driver_method)
    excel_object = excel_instance
    return '打开成功'
@excel_wps_ob.route('read_excel',methods=['POST'])
def read_excel():
    # 初始化 COM 环境
    pythoncom.CoInitialize()
    try:
        excel_data = '无数据'
        print(excel_object)
        read_method = request.get_json()['read_method']
        sheet_name = request.get_json()['sheet_name']
        args = request.get_json()['args']
        print(method)
        print(file_path)
        print(driver_method)
        excel_instance = BaseComponent().open_or_create_excel(method, file_path, driver_method)
        # 使用可变长参数
        if read_method == 'cell_content':
            for key, value in args.items():
                print(f'key:{key},value:{value}')
                print(type(key))
                print(type(value))
                excel_data = BaseComponent().read_excel_content(excel_instance, read_method, sheet_name, int(key), value)
        elif read_method == 'row_content' or read_method == 'col_content':
            for key, value in args.items():
                excel_data = BaseComponent().read_excel_content(excel_instance, read_method, sheet_name, int(value))
        elif read_method == 'area_content':
            list = []
            for key, value in args.items():
                list.append(key)
                list.append(value)
            print(list)
            excel_data = BaseComponent().read_excel_content(excel_instance, read_method, sheet_name, int(list[0]),list[1],int(list[2]),list[3])
        print(excel_data)
        return '获取内容成功'
    finally:
        # 释放 COM 环境
        pythoncom.CoUninitialize()