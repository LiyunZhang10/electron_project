<!-- MainWindow.vue -->
<template>
  <div class="main-window flex-grow p-5 overflow-y-auto h-full ml-2.5 box-border" @dragover.prevent @drop="onDrop">
    <div class="button-container mb-5">
      <el-button :type="isRunning ? 'danger' : 'success'" @click="handleActionClick"
        :disabled="isRunning && !isBrowserOpen">
        {{ isRunning ? '停止' : '运行' }}
      </el-button>
    </div>
    <el-empty v-if="records.length === 0" description="点击左侧指令区添加指令或拖拽指令到此处" />
    <el-timeline v-else>
      <el-timeline-item v-for="record in records" :key="record.id" :type="getRecordType(record.type)" size="large"
        hollow>
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
            打开网址 <el-tag>{{ record.url || '未设置' }}</el-tag> ，将网页对象保存到
            <el-tag>{{ record.savePageObject || '未设置' }}</el-tag>
          </p>
          <p v-else-if="record.type === '点击元素(web)'">
            点击元素 <el-tag>{{ record.operationTarget || '未设置' }}</el-tag>
          </p>
          <p v-else-if="record.type === '获取窗口对象'">
            获取窗口对象：<el-tag>{{ record.windowTitle || '未设置' }}</el-tag>
            <span v-if="record.addWindowType">，窗口类型：<el-tag>{{ record.windowType || '未设置' }}</el-tag></span>
            <span v-if="record.useWildcard">，使用通配符匹配</span>
            ，保存为：<el-tag>{{ record.saveWindowObject || '未设置' }}</el-tag>
          </p>
          <p v-else-if="record.type === '点击元素(win)'">
            在窗口 <el-tag>{{ record.windowObject || '未设置' }}</el-tag> 中，
            点击元素 <el-tag>{{ record.operationTarget || '未设置' }}</el-tag>
          </p>
          <p v-else-if="record.type === '打开/新建Excel'">
            {{ record.openMethod === 'open' ? '打开' : '新建' }} Excel 文件：
            <el-tag>{{ record.excelFilePath || '未设置' }}</el-tag>，
            使用驱动：<el-tag>{{ record.driverType || '未设置' }}</el-tag>
          </p>
          <p v-else-if="record.type === '读取Excel'">
            从 Excel 对象 <el-tag>{{ record.excelObject || '未设置' }}</el-tag> 中，
            {{ getReadMethodDescription(record) }}
            保存数据到：<el-tag>{{ record.saveExcelData || '未设置' }}</el-tag>
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

const emit = defineEmits(['delete-record', 'edit-record', 'run-automation', 'stop-automation', 'add-record'])

const handleActionClick = () => {
  if (props.isRunning) {
    emit('stop-automation')
  } else {
    emit('run-automation')
  }
}

const getRecordType = (type) => {
  switch (type) {
    case '打开网页':
    case '点击元素(web)':
      return 'primary'
    case '获取窗口对象':
    case '点击元素(win)':
      return 'success'
    case '打开/新建Excel':
    case '读取Excel':
      return 'warning'
    default:
      return 'info'
  }
}

const getReadMethodDescription = (record) => {
  switch (record.readMethod) {
    case 'cell':
      return `读取单元格内容：行 ${record.rowNumber || '未设置'}，列 ${record.columnName || '未设置'}`
    case 'row':
      return `读取行内容：行 ${record.rowNumber || '未设置'}`
    case 'column':
      return `读取列内容：列 ${record.columnName || '未设置'}`
    case 'range':
      return `读取区域内容`
    case 'used_range':
      return `读取已使用区域内容`
    default:
      return `读取内容`
  }
}

const onDrop = (event) => {
  const recordType = event.dataTransfer.getData('text')
  emit('add-record', recordType)
}
</script>