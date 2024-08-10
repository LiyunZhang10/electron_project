<!-- src/components/Sidebar.vue -->
<template>
  <el-menu class="sidebar w-1/4 min-w-[200px] max-w-[300px] h-full box-border border-r border-gray-300 shadow-lg">
    <el-sub-menu v-for="menu in menus" :key="menu.index" :index="menu.index">
      <template #title>
        <el-icon>
          <component :is="menu.icon" />
        </el-icon>
        <span>{{ menu.title }}</span>
      </template>
      <el-menu-item v-for="item in menu.items" :key="item.index" :index="item.index"
        @click="$emit('open-dialog', item.name)" draggable="true" @dragstart="dragStart($event, item.name)">
        {{ item.name }}
      </el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script setup>
import { ref } from 'vue'
import { Connection } from '@element-plus/icons-vue'

const emit = defineEmits(['open-dialog'])

const menus = [
  {
    index: '1',
    title: '网页自动化',
    icon: Connection,
    items: [
      { index: '1-1', name: '打开网页' },
      { index: '1-2', name: '点击元素(web)' }
    ]
  },
  {
    index: '2',
    title: '桌面软件自动化',
    icon: Connection,
    items: [
      { index: '2-1', name: '获取窗口对象' },
      { index: '2-2', name: '点击元素(win)' }
    ]
  },
  {
    index: '3',
    title: 'Excel/WPS表格',
    icon: Connection,
    items: [
      { index: '3-1', name: '打开/新建Excel' },
      { index: '3-2', name: '读取Excel' }
    ]
  }
]

const dragStart = (event, recordType) => {
  event.dataTransfer.setData('text/plain', recordType)
}
</script>