<!-- MainWindow.vue -->
<template>
  <div class="main-window">
    <div class="button-container">
      <button @click="$emit('run-automation')" :disabled="isRunning" class="run-btn">运行</button>
      <button @click="$emit('stop-automation')" :disabled="!isRunning" class="stop-btn">停止</button>
    </div>
    <TransitionGroup name="list" tag="div" class="record-list">
      <div v-for="record in records" :key="record.id" class="record">
        <h3>{{ record.type }}</h3>
        <p v-if="record.type === '打开网页'">
          使用 <span class="highlight">{{ record.browserType }}</span> 浏览器打开网址
          <span class="highlight">{{ record.url }}</span> ，将网页对象保存到
          <span class="highlight">{{ record.savePageObject }}</span>
        </p>
        <p v-else-if="record.type === '点击元素(web)'">
          在网页对象 <span class="highlight">{{ record.pageObject }}</span> 中，
          点击元素 <span class="highlight">{{ record.operationTarget }}</span>
        </p>
        <div class="button-group">
          <button @click="$emit('edit-record', record)" class="edit-btn">编辑</button>
          <button @click="$emit('delete-record', record.id)" class="delete-btn">删除</button>
        </div>
      </div>
    </TransitionGroup>
    <div v-if="records.length === 0" class="empty-message">
      点击左侧指令区添加指令
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  records: Array,
  isRunning: Boolean
})

defineEmits(['delete-record', 'edit-record', 'run-automation', 'stop-automation'])
</script>

<style scoped>
.main-window {
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f0f2f5;
  height: 100%;
  margin-left: 10px;
  box-sizing: border-box;
}

.button-container {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.run-btn, .stop-btn {
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.run-btn {
  background-color: #4CAF50;
}

.run-btn:hover:not(:disabled) {
  background-color: #45a049;
}

.stop-btn {
  background-color: #ea4335;
}

.stop-btn:hover:not(:disabled) {
  background-color: #d93025;
}

.run-btn:disabled, .stop-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.record-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.record {
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.record:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}

.record h3 {
  margin-top: 0;
  color: #1a73e8;
  font-weight: 500;
}

.record p {
  color: #202124;
  margin: 10px 0;
  line-height: 1.6;
}

.highlight {
  color: #d93025;
  font-family: 'Roboto Mono', monospace;
  font-size: 1.1em;
  font-weight: 500;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
}

.edit-btn, .delete-btn {
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  font-weight: 500;
  margin-left: 10px;
}

.edit-btn {
  background-color: #1a73e8;
  color: white;
}

.edit-btn:hover {
  background-color: #1967d2;
  transform: translateY(-2px);
}

.delete-btn {
  background-color: #ea4335;
  color: white;
}

.delete-btn:hover {
  background-color: #d93025;
  transform: translateY(-2px);
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.empty-message {
  text-align: center;
  color: #5f6368;
  margin-top: 50px;
  font-size: 1.2em;
  font-style: italic;
}
</style>