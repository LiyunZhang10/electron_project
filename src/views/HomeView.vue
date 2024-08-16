<!-- src/views/HomeView.vue -->
<template>
  <div class="flex h-screen">
    <Sidebar @open-dialog="openDialog" @drag-record="dragRecord" />
    <MainWindow :records="records" :isRunning="isRunning" :isBrowserOpen="isBrowserOpen" @delete-record="deleteRecord"
      @edit-record="editRecord" @run-automation="runAutomation" @stop-automation="stopAutomation"
      @add-record="addEmptyRecord" />
    <DialogBox v-if="showDialog" :submenu="currentSubmenu" :fields="dialogFields" :editingRecord="editingRecord"
      @close="closeDialog" @submit="submitRecord" />
    <el-dialog v-model="showWarning" title="警告" width="30%" center>
      <span>{{ warningMessage }}</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeWarning">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import Sidebar from '@/components/Sidebar.vue'
import MainWindow from '@/components/MainWindow.vue'
import DialogBox from '@/components/DialogBox.vue'
import { openPage, clickElement, closeBrowser, openExcel, readExcel, getWindow, clickElementWin } from '@/services/apiService'

const records = ref([])
const showDialog = ref(false)
const currentSubmenu = ref('')
const editingRecord = ref(null)
const showWarning = ref(false)
const warningMessage = ref('')
const isRunning = ref(false)
const isBrowserOpen = ref(false)
let stopRequested = false
let browserCheckInterval = null
let currentRecordIndex = 0
const windowObject = ref(null)

const dialogFields = computed(() => {
  switch (currentSubmenu.value) {
    case '打开网页':
      return [
        { name: 'url', label: '网址', placeholder: '输入网址', rules: [{ validator: validateUrl, trigger: 'blur' }] },
        { name: 'savePageObject', label: '保存对象', placeholder: '输入保存的页面对象名称', default: 'web_page' }
      ]
    case '点击元素(web)':
      return [
        { name: 'operationTarget', label: '操作元素', placeholder: '输入操作元素', rules: [{ validator: validateLength, max: 256, trigger: 'blur' }] }
      ]
    case '获取窗口对象':
      return [
        { name: 'getWindowMethod', label: '获取窗口方式', type: 'select', options: [{ label: '窗口标题或类型名', value: 'by_title' }, { label: '通过元素查找', value: 'by_element' }], default: 'by_title' },
        { name: 'windowTitle', label: '窗口标题', placeholder: '输入窗口标题', rules: [{ validator: validateLength, max: 256, trigger: 'blur' }] },
        { name: 'addWindowType', label: '添加窗口类型', type: 'checkbox' },
        { name: 'windowType', label: '窗口类型', placeholder: '输入窗口类型', show: 'addWindowType' },
        { name: 'useWildcard', label: '使用通配符匹配', type: 'checkbox' },
        { name: 'saveWindowObject', label: '保存窗口对象', placeholder: '输入保存的窗口对象名称', default: 'wind_title' }
      ];
    case '点击元素(win)':
      return [
        { name: 'windowObject', label: '窗口对象', type: 'select', options: [{ label: windowObject.value, value: windowObject.value}] },
        { name: 'operationTarget', label: '操作元素', type: 'file', accept: 'image/' }
      ];
    case '打开/新建Excel':
      return [
        { name: 'openMethod', label: '启动方式', type: 'select', options: [{ label: '打开Excel', value: 'open' }, { label: '新建Excel', value: 'new' }], default: 'open' },
        { name: 'excelFilePath', label: 'Excel文件路径', accept: '.xlsx,.xls' },
        { name: 'driverType', label: '驱动方式', type: 'select', options: [{ label: 'Office', value: 'office' }, { label: 'WPS', value: 'wps' }, { label: 'OpenPyXL', value: 'openpyxl' }] }
      ]
    case '读取Excel':
      return [
        { name: 'readMethod', label: '读取方式', type: 'select', options: [{ label: '单元格内容', value: 'cell_content' }, { label: '行内容', value: 'row_content' }, { label: '列内容', value: 'col_content' }, { label: '区域内容', value: 'area_content' }, { label: '已使用区域内容', value: 'used_area_content' }], default: 'cell' },
        { name: 'cellAddress', label: '单元格地址', placeholder: '输入单元格地址', rules: [{ validator: validateLength, max: 16, trigger: 'blur' }] },
        { name: 'rowNumber', label: '行号', placeholder: '输入行号', rules: [{ validator: validateLength, max: 16, trigger: 'blur' }] },
        { name: 'colNumber', label: '列名', placeholder: '输入列名', rules: [{ validator: validateLength, max: 16, trigger: 'blur' }] },
        { name: 'firstRowNumber', label: '首元素行号', placeholder: '输入行号', rules: [{ validator: validateLength, max: 16, trigger: 'blur' }] },
        { name: 'firstColNumber', label: '首元素列名', placeholder: '输入列名', rules: [{ validator: validateLength, max: 16, trigger: 'blur' }] },
        { name: 'lastRowNumber', label: '末元素行号', placeholder: '输入行号', rules: [{ validator: validateLength, max: 16, trigger: 'blur' }] },
        { name: 'lastColNumber', label: '末元素列名', placeholder: '输入列名', rules: [{ validator: validateLength, max: 16, trigger: 'blur' }] },
        { name: 'sheetName', label: 'Sheet名', placeholder: '输入Sheet名', rules: [{ validator: validateLength, max: 64, trigger: 'blur' }] },
      ]
    default:
      return []
  }
})

const validateUrl = (rule, value, callback) => {
  if (!value || /^(http|https):\/\/[^\s/$.?#].[^\s]*$/.test(value)) {
    callback()
  } else {
    callback(new Error('网址格式不正确'))
  }
}

const validateLength = (rule, value, callback) => {
  if (!value || value.length <= rule.max) {
    callback()
  } else {
    callback(new Error(`长度不能超过${rule.max}字符`))
  }
}

const openDialog = (type) => {
  currentSubmenu.value = type
  editingRecord.value = null
  showDialog.value = true
}

const addEmptyRecord = (type) => {
  const newRecord = {
    id: Date.now(),
    type: type,
  }
  records.value.push(newRecord)
  editRecord(newRecord)
}

const dragRecord = (type) => {
  addEmptyRecord(type)
}

const editRecord = (record) => {
  editingRecord.value = { ...record }
  currentSubmenu.value = record.type
  showDialog.value = true
}

const deleteRecord = (id) => {
  const index = records.value.findIndex(record => record.id === id)
  if (index !== -1) {
    records.value.splice(index, 1)
  }
}

const closeDialog = () => {
  showDialog.value = false
  editingRecord.value = null
}

const submitRecord = (info) => {
  if (editingRecord.value) {
    const index = records.value.findIndex(record => record.id === editingRecord.value.id)
    if (index !== -1) {
      records.value[index] = { ...records.value[index], ...info }
    }
  } else {
    const newRecord = {
      id: Date.now(),
      type: currentSubmenu.value,
      ...info
    }
    records.value.push(newRecord)
  }
  closeDialog()
  ElMessage.success('记录已保存')
}

const runAutomation = async () => {
  if (records.value.length === 0) {
    ElMessage.warning('没有可执行的记录。')
    return
  }

  if (isRunning.value || isBrowserOpen.value) {
    ElMessage.warning('自动化任务已在运行中或浏览器仍然打开')
    return
  }

  try {
    isRunning.value = true
    isBrowserOpen.value = true
    stopRequested = false
    startBrowserCheck()

    for (currentRecordIndex = 0; currentRecordIndex < records.value.length; currentRecordIndex++) {
      if (stopRequested) break
      const record = records.value[currentRecordIndex]
      try {
        switch (record.type) {
          case '打开网页':
            await openPage(record.url)
            break
          case '点击元素(web)':
            await clickElement(record.operationTarget)
            break
          case '获取窗口对象':
            windowObject.value = await getWindow(record);
            console.log("windowObject", windowObject.value)
            break;
          case '点击元素(win)':
            const formData = new FormData();
            formData.append('window_title', record.windowObject);
            formData.append('loc', record.operationTarget);
            console.log("formData", formData)
            await clickElementWin(formData);
            break;
          case '打开/新建Excel':
            await openExcel(record)
            break
          case '读取Excel':
            await readExcel(record)
            break
        }
        await new Promise(resolve => setTimeout(resolve, 5000))
      } catch (error) {
        ElMessage.error(`执行操作 "${record.type}" 时出错: ${error.message}`)
        throw error // 重新抛出错误以停止自动化过程
      }
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    if (!stopRequested) {
      ElMessage.success('自动化任务已执行完毕。')
    }
  } catch (error) {
    console.error('自动化执行失败:', error)
    ElMessage.error(`自动化执行失败: ${error.message}`)
  } finally {
    isRunning.value = false
    stopBrowserCheck()
    isBrowserOpen.value = false
  }
}

const stopAutomation = async () => {
  if (isBrowserOpen.value) {
    stopRequested = true
    isRunning.value = false
    ElMessage.info('正在关闭浏览器，请稍候...')
    try {
      await closeBrowser()
      isBrowserOpen.value = false
      ElMessage.success('浏览器已关闭')
    } catch (error) {
      console.error('关闭浏览器失败:', error)
      ElMessage.error(`关闭浏览器失败，请手动关闭浏览器: ${error.message}`)
    }
  } else {
    ElMessage.info('没有打开的浏览器')
  }
}

const startBrowserCheck = () => {
  if (browserCheckInterval) {
    clearInterval(browserCheckInterval)
  }
  browserCheckInterval = setInterval(checkBrowserOpen, 5000)
}

const stopBrowserCheck = () => {
  if (browserCheckInterval) {
    clearInterval(browserCheckInterval)
    browserCheckInterval = null
  }
}

const checkBrowserOpen = () => {
  if (!isRunning.value && isBrowserOpen.value) {
    ElMessage.warning('浏览器仍然打开')
  }
}

onMounted(() => {
  startBrowserCheck()
})

onUnmounted(() => {
  stopBrowserCheck()
})
</script>