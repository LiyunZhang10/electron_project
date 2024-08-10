<!-- src/views/HomeView.vue -->
<template>
  <div class="flex h-screen">
    <Sidebar @add-record="openDialog" />
    <MainWindow :records="records" :isRunning="isRunning" :isBrowserOpen="isBrowserOpen" @delete-record="deleteRecord"
      @edit-record="editRecord" @run-automation="runAutomation" @stop-automation="stopAutomation" />
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
import { openPage, clickElement, closeBrowser, openExcel, readExcel } from '@/services/apiService'

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

const dialogFields = computed(() => {
  if (currentSubmenu.value === '打开网页') {
    return [
      { name: 'url', label: '网址', placeholder: '输入网址', rules: [{ required: true, message: '网址不能为空', trigger: 'blur' }, { validator: validateUrl, message: '网址格式不正确', trigger: 'blur' }] },
      { name: 'savePageObject', label: '保存页面对象', placeholder: '输入保存的页面对象名称' }
    ]
  } else if (currentSubmenu.value === '点击元素(web)') {
    return [
      { name: 'operationTarget', label: '操作目标', placeholder: '输入操作目标' }
    ]
  } else if (currentSubmenu.value === '打开/新建Excel') {
    return [
      { name: 'excelFilePath', label: 'Excel文件路径', placeholder: '上传Excel文件' }
    ]
  } else if (currentSubmenu.value === '读取Excel') {
    return [
      { name: 'sheetName', label: 'Sheet名', placeholder: '输入Sheet名' }
    ]
  }
  return []
})

const openDialog = (type) => {
  currentSubmenu.value = type
  editingRecord.value = null
  showDialog.value = true
}

const closeDialog = () => {
  showDialog.value = false
  editingRecord.value = null
}

const validateUrl = (rule, value, callback) => {
  const urlPattern = /^(http|https):\/\/[^\s/$.?#].[^\s]*$/;
  if (!value) {
    callback(new Error('网址不能为空'));
  } else if (!urlPattern.test(value)) {
    callback(new Error('网址格式不正确'));
  } else {
    callback();
  }
}

const submitRecord = async (info) => {
  const newRecord = {
    id: Date.now(),
    type: currentSubmenu.value,
    ...info
  }
  records.value.push(newRecord)
  closeDialog()
}

const deleteRecord = (id) => {
  const index = records.value.findIndex(record => record.id === id)
  if (index !== -1) {
    records.value.splice(index, 1)
  }
}

const editRecord = (record) => {
  editingRecord.value = { ...record }
  currentSubmenu.value = record.type
  showDialog.value = true
}

const closeWarning = () => {
  showWarning.value = false
  warningMessage.value = ''
}

const runAutomation = async () => {
  if (records.value.length === 0) {
    showWarning.value = true
    warningMessage.value = '没有可执行的记录。'
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

    // 执行自动化任务
    for (currentRecordIndex = 0; currentRecordIndex < records.value.length; currentRecordIndex++) {
      if (stopRequested) break
      const record = records.value[currentRecordIndex]
      if (record.type === '打开网页') {
        await openPage(record.url)
      } else if (record.type === '点击元素(web)') {
        await clickElement(record.operationTarget)
      }
      await new Promise(resolve => setTimeout(resolve, 1000)) // 等待1秒
    }

    if (!stopRequested) {
      await ElMessageBox.alert('自动化任务已执行完毕。', '执行完成', {
        confirmButtonText: '确定'
      })
    }
  } catch (error) {
    console.error('自动化执行失败:', error)
    await ElMessageBox.alert(error.message, '自动化执行失败', {
      confirmButtonText: '确定',
      type: 'error'
    })
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
      ElMessage.error('关闭浏览器失败，请手动关闭浏览器')
    }
  } else {
    ElMessage.info('没有打开的浏览器')
  }
}

const startBrowserCheck = () => {
  if (browserCheckInterval) {
    clearInterval(browserCheckInterval)
  }
  browserCheckInterval = setInterval(checkBrowserOpen, 5000) // 每5秒检查一次
}

const stopBrowserCheck = () => {
  if (browserCheckInterval) {
    clearInterval(browserCheckInterval)
    browserCheckInterval = null
  }
}

const checkBrowserOpen = () => {
  if (!isRunning.value && isBrowserOpen.value) {
    console.log('浏览器仍然打开')
  }
}

onMounted(() => {
  startBrowserCheck()
})

onUnmounted(() => {
  stopBrowserCheck()
})
</script>