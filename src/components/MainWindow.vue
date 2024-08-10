<!-- MainWindow.vue -->
<template>
  <div class="main-window flex-grow p-5 overflow-y-auto h-full ml-2.5 box-border">
    <div class="button-container mb-5">
      <el-button :type="isRunning ? 'danger' : 'success'" @click="handleActionClick"
        :disabled="isRunning && !isBrowserOpen">
        {{ isRunning ? '停止' : '运行' }}
      </el-button>
    </div>
    <el-empty v-if="records.length === 0" description="点击左侧指令区添加指令" />
    <el-timeline v-else>
      <el-timeline-item v-for="record in records" :key="record.id"
        :type="record.type === '打开网页' ? 'primary' : 'success'" size="large" hollow>
        <el-card class="record-card mb-5">
          <template #header>
            <div class="card-header flex justify-between items-center">
              <h3 class="m-0">{{ record.type }}</h3>
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
import { ref } from 'vue'

const props = defineProps({
  records: Array,
  isRunning: Boolean,
  isBrowserOpen: Boolean
})

const emit = defineEmits(['delete-record', 'edit-record', 'run-automation', 'stop-automation'])

const handleActionClick = () => {
  if (props.isRunning) {
    emit('stop-automation')
  } else {
    emit('run-automation')
  }
}
</script>