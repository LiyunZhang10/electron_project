import os

import pygetwindow
from flask import Blueprint, request
from rpa_project.desktop_software_auto.desktop_auto_component import DesktopAutoComponent

desk_auto_ob = Blueprint('desk_auto',__name__,url_prefix='/desk_auto')

@desk_auto_ob.route('get_window',methods=['POST'])
def get_window():
    content_type = request.headers.get('Content-Type')
    if 'multipart/form-data' in content_type:
        method = request.form['method']
        loc = request.files['loc']
        # 创建uploads文件夹(如果不存在)
        upload_folder = 'uploads'
        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder)
            # 保存上传的文件
        file_path = os.path.join(upload_folder, loc.filename)
        loc.save(file_path)
    else:
        method = request.get_json()['method']
        loc = request.get_json()['loc']
    window = DesktopAutoComponent().get_windows_object(get_wind_method=method,wind_title=loc,operate_target=file_path,wind_handle=loc)
    return window.title

@desk_auto_ob.route('click_element',methods=['POST'])
def click_element():
    desk_auto_component = DesktopAutoComponent()
    window_title = request.form['window_title']
    loc = request.files['loc']
    # 创建uploads文件夹(如果不存在)
    upload_folder = 'uploads'
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)
        # 保存上传的文件
    file_path = os.path.join(upload_folder, loc.filename)
    loc.save(file_path)
        # 使用 pygetwindow 激活指定窗口
    try:
        # window = pygetwindow.getWindowsWithTitle(window_title)[0]
        window = desk_auto_component.get_windows_object(get_wind_method='by_title',wind_title=window_title)
        desk_auto_component.click_element(window,file_path)
        return 'Window activated successfully'
    except IndexError:
        return 'Window not found', 404
