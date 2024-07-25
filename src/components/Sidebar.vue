<!-- Sidebar.vue -->
<template>
  <el-menu class="sidebar" :collapse="isCollapse">
    <el-sub-menu index="1">
      <template #title>
        <el-icon><Connection /></el-icon>
        <span>网页自动化</span>
      </template>
      <el-menu-item index="1-1" @click="$emit('add-record', '打开网页')">打开网页</el-menu-item>
      <el-menu-item index="1-2" @click="$emit('add-record', '点击元素(web)')">点击元素(web)</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script setup>
import { ref } from 'vue'
import { Connection } from '@element-plus/icons-vue'

defineEmits(['add-record'])
const isCollapse = ref(false)
</script>

<style scoped>
.sidebar {
  width: 25%;
  min-width: 200px;
  max-width: 300px;
  height: 100%;
  box-sizing: border-box;
  border-right: 1px solid var(--el-border-color-light);
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}
</style>