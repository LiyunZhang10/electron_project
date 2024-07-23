from flask import Flask, request, jsonify
from flask_cors import CORS
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.remote.remote_connection import RemoteConnection

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# 配置 Chrome 浏览器驱动
# chrome_options = Options()
# chrome_options.add_argument("--headless")  # 如果你不需要图形界面，可以启用无头模式

# 创建一个全局 WebDriver 实例
webdriver_instance = None

@app.route('/open', methods=['POST'])
def open_browser():
    global webdriver_instance
    url = request.json.get('url')
    if not url:
        return jsonify({"error": "URL is required"}), 400
    
    chrome_options = Options()
    chrome_options.binary_location = r"D:/Google/Chrome/Application/chrome.exe"
    
    service = Service(executable_path=r"D:/Google/Chrome/Application/chromedriver.exe")
    
    # 初始化 WebDriver 实例
    webdriver_instance = webdriver.Chrome(service=service, options=chrome_options)
    webdriver_instance.get(url)
    
    return jsonify({"message": "Browser opened successfully"}), 200

@app.route('/click', methods=['POST'])
def click_element():
    if webdriver_instance is None:
        return jsonify({"error": "Browser is not opened"}), 400
    
    element_selector = request.json.get('selector')
    if not element_selector:
        return jsonify({"error": "Element selector is required"}), 400
    try:
        # 选择并点击元素
        element = webdriver_instance.find_element(By.CSS_SELECTOR, element_selector)
        element.click()
        return jsonify({"message": "Element clicked successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/close', methods=['POST'])
def close_browser():
    global webdriver_instance
    if webdriver_instance:
        webdriver_instance.quit()
        webdriver_instance = None
        return jsonify({"message": "Browser closed successfully"}), 200
    return jsonify({"error": "Browser is not opened"}), 400

if __name__ == '__main__':
    app.run(host='127.0.0.1', debug=True)
    # url='https://www.baidu.com'
    # webdriver_instance = webdriver.Chrome()
    # webdriver_instance.get(url)