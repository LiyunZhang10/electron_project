<!-- App.vue -->
<template>
  <div class="app-container">
    <Sidebar @add-record="openDialog" />
    <MainWindow 
      :records="records" 
      :isRunning="isRunning"
      @delete-record="deleteRecord" 
      @edit-record="editRecord"
      @run-automation="runAutomation"
      @stop-automation="stopAutomation"
    />
    <DialogBox
      v-if="showDialog"
      :submenu="currentSubmenu"
      :fields="dialogFields"
      :editingRecord="editingRecord"
      @close="closeDialog"
      @submit="submitRecord"
    />
    <div v-if="showWarning" class="warning-overlay">
      <div class="warning-box">
        <p>{{ warningMessage }}</p>
        <button @click="closeWarning">确定</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import MainWindow from '@/components/MainWindow.vue'
import DialogBox from '@/components/DialogBox.vue'
import { openPage, clickElement, closeBrowser } from '@/services/apiService';

const records = ref([])
const showDialog = ref(false)
const currentSubmenu = ref('')
const editingRecord = ref(null)
const showWarning = ref(false)
const warningMessage = ref('')
const isRunning = ref(false)
let stopRequested = false

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

  if (isRunning.value) {
    alert('自动化任务已在运行中')
    return
  }

  try {
    isRunning.value = true
    stopRequested = false
    // 打开浏览器
    const firstRecord = records.value[0]
    if (firstRecord.type !== '打开网页') {
      throw new Error('第一条记录必须是打开网页')
    }
    await openPage(firstRecord.url)

    // 执行后续操作
    for (let i = 1; i < records.value.length; i++) {
      if (stopRequested) break; // 如果收到停止请求，就退出循环
      await new Promise(resolve => setTimeout(resolve, 10000))
      const record = records.value[i]
      if (record.type === '点击元素(web)') {
        await clickElement(record.operationTarget)
      }
    }

    if (!stopRequested) {
      alert('自动化任务已执行完毕，浏览器保持打开状态')
    }
  } catch (error) {
    console.error('自动化执行失败:', error)
    alert('自动化执行失败: ' + error.message)
  }
}

const stopAutomation = async () => {
  if (isRunning.value) {
    stopRequested = true
    await closeBrowser()
    isRunning.value = false
    alert('自动化已停止，浏览器已关闭')
  } else {
    alert('没有正在运行的自动化任务')
  }
}

</script>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
}

.warning-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.warning-box {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
}

.warning-box button {
  margin-top: 10px;
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}
</style>