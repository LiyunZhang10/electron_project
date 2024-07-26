<!-- MainWindow.vue -->
<template>
  <div class="main-window">
    <div class="button-container">
      <el-button type="success" @click="$emit('run-automation')" :disabled="isRunning || isBrowserOpen">运行</el-button>
      <el-button type="warning" @click="$emit('pause-automation')" :disabled="!isRunning || isPaused">暂停</el-button>
      <el-button type="info" @click="$emit('resume-automation')" :disabled="!isPaused">继续</el-button>
      <el-button type="danger" @click="$emit('stop-automation')" :disabled="!isBrowserOpen">停止</el-button>
    </div>
    <el-empty v-if="records.length === 0" description="点击左侧指令区添加指令" />
    <el-timeline v-else>
      <el-timeline-item v-for="record in records" :key="record.id"
        :type="record.type === '打开网页' ? 'primary' : 'success'" :size="'large'" :hollow="true">
        <el-card class="record-card">
          <template #header>
            <div class="card-header">
              <h3>{{ record.type }}</h3>
              <div>
                <el-button type="primary" @click="$emit('edit-record', record)" text>编辑</el-button>
                <el-button type="danger" @click="$emit('delete-record', record.id)" text>删除</el-button>
              </div>
            </div>
          </template>
          <p v-if="record.type === '打开网页'">
            使用 <el-tag>{{ record.browserType }}</el-tag> 浏览器打开网址
            <el-tag>{{ record.url }}</el-tag> ，将网页对象保存到
            <el-tag>{{ record.savePageObject }}</el-tag>
          </p>
          <p v-else-if="record.type === '点击元素(web)'">
            在网页对象 <el-tag>{{ record.pageObject }}</el-tag> 中，
            点击元素 <el-tag>{{ record.operationTarget }}</el-tag>
          </p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script setup>
defineProps({
  records: Array,
  isRunning: Boolean,
  isBrowserOpen: Boolean,
  isPaused: Boolean
})

defineEmits(['delete-record', 'edit-record', 'run-automation', 'stop-automation', 'pause-automation', 'resume-automation'])
</script>

<style scoped>
.main-window {
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
  height: 100%;
  margin-left: 10px;
  box-sizing: border-box;
}

.button-container {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.record-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
}

.el-tag {
  white-space: normal !important;
  height: auto !important;
}
</style>
