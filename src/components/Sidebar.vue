<!-- src/components/Sidebar.vue -->
<template>
  <el-menu class="sidebar w-1/4 min-w-[200px] max-w-[300px] h-full box-border border-r border-gray-300 shadow-lg">
    <el-sub-menu index="1">
      <template #title>
        <el-icon>
          <Connection />
        </el-icon>
        <span>网页自动化</span>
      </template>
      <el-menu-item index="1-1" @click="$emit('add-record', '打开网页')">打开网页</el-menu-item>
      <el-menu-item index="1-2" @click="$emit('add-record', '点击元素(web)')">点击元素(web)</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="2">
      <template #title>
        <el-icon>
          <Connection />
        </el-icon>
        <span>桌面软件自动化</span>
      </template>
      <el-menu-item index="2-1" @click="$emit('add-record', '获取窗口对象')">获取窗口对象</el-menu-item>
      <el-menu-item index="2-2" @click="$emit('add-record', '点击元素(win)')">点击元素(win)</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="3">
      <template #title>
        <el-icon>
          <Connection />
        </el-icon>
        <span>Excel/WPS表格</span>
      </template>
      <el-menu-item index="3-1" @click="$emit('add-record', '打开/新建Excel')">打开/新建Excel</el-menu-item>
      <el-menu-item index="3-2" @click="$emit('add-record', '读取Excel')">读取Excel</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script setup>
import { ref } from 'vue'
import { Connection } from '@element-plus/icons-vue'

defineEmits(['add-record'])
const isCollapse = ref(false)
</script>