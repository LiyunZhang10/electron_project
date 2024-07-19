<template>
  <div class="main-window">
    <h2>主窗口</h2>
    <div v-if="records.length === 0" class="no-records">
      暂无记录
    </div>
    <TransitionGroup name="list" tag="div" class="record-list">
      <div v-for="record in records" :key="record.id" class="record">
        <div class="record-content">
          <h3>{{ record.type }}</h3>
          <p><strong>标题:</strong> {{ record.title }}</p>
          <p><strong>描述:</strong> {{ record.description }}</p>
          <p><strong>类别:</strong> {{ record.category }}</p>
          <small>{{ record.date }}</small>
        </div>
        <button @click="$emit('delete-record', record.id)" class="delete-btn">删除</button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
defineProps({
  records: Array
})

defineEmits(['delete-record'])
</script>

<style scoped>
.main-window {
  flex-grow: 1;
  padding: 30px;
  overflow-y: auto;
  background-color: #ecf0f1;
}

h2 {
  margin-top: 0;
  color: #2c3e50;
  font-weight: 500;
  font-size: 1.8em;
  padding-bottom: 15px;
  border-bottom: 2px solid #bdc3c7;
}

.no-records {
  text-align: center;
  color: #7f8c8d;
  font-style: italic;
  margin-top: 20px;
  font-size: 1.2em;
}

.record-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px 0;
}

.record {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.record:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.record-content {
  flex-grow: 1;
}

.record h3 {
  margin-top: 0;
  color: #2980b9;
  font-weight: 500;
}

.record p {
  color: #34495e;
  margin: 10px 0;
}

.record small {
  color: #7f8c8d;
  display: block;
  margin-top: 15px;
}

.delete-btn {
  align-self: flex-end;
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

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>