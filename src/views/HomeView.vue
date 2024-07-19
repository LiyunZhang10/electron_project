<template>
  <div class="app">
    <Sidebar @add-record="addRecord" />
    <MainWindow :records="records" @delete-record="deleteRecord" />
    <DialogBox
      v-if="showDialog"
      :submenu="currentSubmenu"
      @close="closeDialog"
      @submit="submitDialog"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import MainWindow from '@/components/MainWindow.vue'
import DialogBox from '@/components/DialogBox.vue'

const records = ref([])
const showDialog = ref(false)
const currentSubmenu = ref('')

const addRecord = (submenu) => {
  currentSubmenu.value = submenu
  showDialog.value = true
}

const closeDialog = () => {
  showDialog.value = false
}

const submitDialog = (info) => {
  records.value.push({
    id: Date.now() + Math.random(),
    type: currentSubmenu.value,
    ...info,
    date: new Date().toLocaleString()
  })
  showDialog.value = false
}

const deleteRecord = (id) => {
  records.value = records.value.filter(record => record.id !== id)
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');

body {
  margin: 0;
  font-family: 'Roboto', sans-serif;
  background-color: #f5f5f5;
  overflow: hidden;
}

.app {
  display: flex;
  height: 100vh;
  max-height: 100vh;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>