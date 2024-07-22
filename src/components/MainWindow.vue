<!-- MainWindow.vue -->
<template>
  <div class="main-window">
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
        <button @click="$emit('edit-record', record)" class="edit-btn">编辑</button>
        <button @click="$emit('delete-record', record.id)" class="delete-btn">删除</button>
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
  records: Array
})

defineEmits(['delete-record', 'edit-record'])
</script>

<style scoped>
.main-window {
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f9f9f9;
  height: 100%;
  margin-left: 10px;
  box-sizing: border-box;
}

.record-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 10px;
}

.record {
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.record:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.record h3 {
  margin-top: 0;
  color: #2980b9;
  font-weight: 500;
}

.record p {
  color: #34495e;
  margin: 10px 0;
  line-height: 1.6;
}

.highlight {
  color: #e74c3c;
  font-family: 'Courier New', monospace;
  font-size: 1.1em;
  font-style: italic;
}

.delete-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 15px;
}

.delete-btn:hover {
  background-color: #c0392b;
}

.edit-btn {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 15px;
  margin-right: 10px;
}
.edit-btn:hover {
  background-color: #2980b9;
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
  color: #7f8c8d;
  margin-top: 20px;
  font-size: 1.2em;
}
</style>