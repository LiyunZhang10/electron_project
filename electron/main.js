import { createRequire } from 'module'; 
const require = createRequire(import.meta.url);

const { app, BrowserWindow, Menu, screen } = require('electron')
const path = require("path");

// 是否是生产环境
// const isPackaged = app.isPackaged;

// 禁止显示默认菜单
Menu.setApplicationMenu(null);


const createWindow = () => {
  const mainWindow = new BrowserWindow({
    title: "RPA机器人",
    width: 800,
    height: 600,
    // 窗口图标。 在 Windows 上推荐使用 ICO 图标来获得最佳的视觉效果, 默认使用可执行文件的图标.
    // 在根目录中新建 build 文件夹存放图标等文件
    icon: path.resolve("build/robot.ico")
  })
  
  // 开发环境下，打开开发者工具。
  // if (!isPackaged) {
  //   mainWindow.webContents.openDevTools();
  // }
  
  // 使用 loadFile 加载 electron/index.html 文件
//   mainWindow.loadFile("electron/index.html");
  mainWindow.loadURL("http://localhost:3004/");
};

// 在应用准备就绪时调用函数
app.whenReady().then(() => {
  createWindow()
})
