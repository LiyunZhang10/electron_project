<!-- App.vue -->
<template>
  <div class="app-container">
    <Sidebar @add-record="openDialog" />
    <MainWindow 
      :records="records" 
      :isRunning="isRunning"
      :isBrowserOpen="isBrowserOpen"
      :isPaused="isPaused"
      @delete-record="deleteRecord" 
      @edit-record="editRecord"
      @run-automation="runAutomation"
      @stop-automation="stopAutomation"
      @pause-automation="pauseAutomation"
      @resume-automation="resumeAutomation"
    />
    <DialogBox
      v-if="showDialog"
      :submenu="currentSubmenu"
      :fields="dialogFields"
      :editingRecord="editingRecord"
      @close="closeDialog"
      @submit="submitRecord"
    />
    <el-dialog
      v-model="showWarning"
      title="警告"
      width="30%"
      center
    >
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
import { openPage, clickElement, closeBrowser } from '@/services/apiService'

const records = ref([])
const showDialog = ref(false)
const currentSubmenu = ref('')
const editingRecord = ref(null)
const showWarning = ref(false)
const warningMessage = ref('')
const isRunning = ref(false)
const isBrowserOpen = ref(false)
const isPaused = ref(false)
let stopRequested = false
let pauseRequested = false
let browserCheckInterval = null
let currentRecordIndex = 0

const dialogFields = computed(() => {
  if (currentSubmenu.value === '打开网页') {
    return [
      { name: 'browserType', label: '浏览器类型', placeholder: '输入浏览器类型' },
      { name: 'url', label: '网址', placeholder: '输入网址' },
      { name: 'savePageObject', label: '保存页面对象', placeholder: '输入保存的页面对象名称' }
    ]
  } else if (currentSubmenu.value === '点击元素(web)') {
    return [
      { name: 'pageObject', label: '页面对象', placeholder: '输入页面对象' },
      { name: 'operationTarget', label: '操作目标', placeholder: '输入操作目标' }
    ]
  }
  return []
})

const openDialog = (type) => {
  if (type === '打开网页' && records.value.length > 0) {
    showWarning.value = true
    warningMessage.value = '只能添加一条打开网页记录，且必须是第一条。'
    return
  }
  if (type === '点击元素(web)' && records.value.length === 0) {
    showWarning.value = true
    warningMessage.value = '必须先添加一条打开网页记录。'
    return
  }
  currentSubmenu.value = type
  editingRecord.value = null
  showDialog.value = true
}

const closeDialog = () => {
  showDialog.value = false
  editingRecord.value = null
}

const submitRecord = (info) => {
  if (editingRecord.value) {
    const index = records.value.findIndex(record => record.id === editingRecord.value.id)
    if (index !== -1) {
      records.value[index] = { ...editingRecord.value, ...info }
    }
  } else {
    const newRecord = {
      id: Date.now(),
      type: currentSubmenu.value,
      ...info
    }
    if (newRecord.type === '打开网页') {
      records.value.unshift(newRecord)
    } else {
      records.value.push(newRecord)
    }
  }
  closeDialog()
}

const deleteRecord = (id) => {
  const index = records.value.findIndex(record => record.id === id)
  if (index === 0) {
    records.value = []
  } else {
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
    pauseRequested = false
    isPaused.value = false
    startBrowserCheck()

    // 打开浏览器
    const firstRecord = records.value[0]
    if (firstRecord.type !== '打开网页') {
      throw new Error('第一条记录必须是打开网页')
    }
    await openPage(firstRecord.url)

    // 执行后续操作
    for (currentRecordIndex = 1; currentRecordIndex < records.value.length; currentRecordIndex++) {
      if (stopRequested) break
      while (pauseRequested) {
        await new Promise(resolve => setTimeout(resolve, 100))
        if (stopRequested) break // 在暂停时也检查是否请求停止
      }
      if (stopRequested) break
      await new Promise(resolve => setTimeout(resolve, 1000))
      const record = records.value[currentRecordIndex]
      if (record.type === '点击元素(web)') {
        await clickElement(record.operationTarget)
      }
      await new Promise(resolve => setTimeout(resolve, 10000))
    }

    if (!stopRequested) {
      await ElMessageBox.alert('自动化任务已执行完毕，浏览器保持打开状态。如需关闭浏览器，请点击停止按钮。', '执行完成', {
        confirmButtonText: '确定'
      })
    }
  } catch (error) {
    console.error('自动化执行失败:', error)
    await ElMessageBox.alert(error.message, '自动化执行失败', {
      confirmButtonText: '确定',
      type: 'error'
    })
  } finally {
    isRunning.value = false
    isPaused.value = false
  }
}

const stopAutomation = async () => {
  if (isBrowserOpen.value) {
    stopRequested = true
    pauseRequested = false
    isPaused.value = false
    isRunning.value = false
    ElMessage.info('正在关闭浏览器，请稍候...')
    
    try {
      await Promise.race([
        closeBrowser(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('关闭浏览器超时')), 10000))
      ])
      isBrowserOpen.value = false
      ElMessage.success('浏览器已关闭')
    } catch (error) {
      console.error('关闭浏览器失败:', error)
      ElMessage.error('关闭浏览器失败，请手动关闭浏览器')
    } finally {
      stopBrowserCheck()
    }
  } else {
    ElMessage.info('没有打开的浏览器')
  }
}

const pauseAutomation = () => {
  if (isRunning.value && !isPaused.value) {
    pauseRequested = true
    isPaused.value = true
    ElMessage.info('自动化任务已暂停')
  }
}

const resumeAutomation = () => {
  if (isPaused.value) {
    pauseRequested = false
    isPaused.value = false
    ElMessage.info('自动化任务已恢复')
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
  // 这里我们只在isRunning为false时检查，因为运行中的任务我们认为浏览器一定是打开的
  if (!isRunning.value && isBrowserOpen.value) {
    // 这里可以添加额外的检查逻辑，比如通过轻量级的API调用来确认浏览器状态
    // 现在我们只是假设浏览器仍然是打开的
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

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
}
</style>