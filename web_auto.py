import time
from flask import Blueprint, request, g
from marshmallow import fields
from selenium.webdriver.common.by import By
from rpa_project.web_auto.web_auto import WebAuto


web_auto_ob = Blueprint('web_auto', __name__, url_prefix='/web_auto')
web_auto = None


@web_auto_ob.route('/open_web', methods=['POST'])
def open_web():
    global web_auto
    url = request.get_json()
    print(url)
    web_auto = WebAuto()
    print(url['url'])
    web_auto.open_web(url['url'])
    
    return '网页打开成功'
@web_auto_ob.route('/click_element', methods=['POST'])
def click_element():
    # global web_auto
    loc = request.get_json()
    loc = (By.XPATH, loc)
    print('-------------------')
    web_auto.click_element(loc)
    return '点击元素成功'

@web_auto_ob.route('close_web',methods=['GET'])
def close_web():
    web_auto.close_web()
    return '网页关闭成功'

@web_auto_ob.route('get_title',methods=['GET'])
def get_title():
    web_auto.get_page_title()
    return '获取网页成功'

@web_auto_ob.route('take_screenshot',methods=['POST'])
def take_screenshot():
    path = request.get_json()
    web_auto.take_screenshot(path)
    return '网页截图成功'