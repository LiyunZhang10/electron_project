<template>
  <div class="app-container">
    <Sidebar @add-record="openDialog" />
    <MainWindow :records="records" @delete-record="deleteRecord" @edit-record="editRecord" />
    <DialogBox
      v-if="showDialog"
      :submenu="currentSubmenu"
      :fields="dialogFields"
      :editingRecord="editingRecord"
      @close="closeDialog"
      @submit="submitRecord"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import MainWindow from '@/components/MainWindow.vue'
import DialogBox from '@/components/DialogBox.vue'

const records = ref([])
const showDialog = ref(false)
const currentSubmenu = ref('')
const editingRecord = ref(null)

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
      records.value[index] = { ...records.value[index], ...info }
    }
  } else {
    records.value.push({
      id: Date.now(),
      type: currentSubmenu.value,
      ...info
    })
  }
  closeDialog()
}

const deleteRecord = (id) => {
  records.value = records.value.filter(record => record.id !== id)
}

const editRecord = (record) => {
  editingRecord.value = record
  currentSubmenu.value = record.type
  showDialog.value = true
}
</script>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
}
</style>