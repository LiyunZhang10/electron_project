<!-- Sidebar.vue -->
<template>
  <div class="sidebar">
    <div class="menu-item">
      <button @click="toggleSubmenu" :class="{ active: showSubmenu }">
        <span>网页自动化</span>
        <span class="arrow" :class="{ down: showSubmenu }">▶</span>
      </button>
      <transition name="submenu">
        <div v-if="showSubmenu" class="submenu">
          <button @click="$emit('add-record', '打开网页')">打开网页</button>
          <button @click="$emit('add-record', '点击元素(web)')">点击元素(web)</button>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
defineEmits(['add-record'])
const showSubmenu = ref(false)
const toggleSubmenu = () => {
  showSubmenu.value = !showSubmenu.value
}
</script>

<style scoped>
.sidebar {
  width: 25%;
  min-width: 200px;
  max-width: 300px;
  background-color: #ffffff;
  padding: 20px;
  color: #333;
  overflow-y: auto;
  height: 100%;
  box-sizing: border-box;
  border-right: 1px solid #e0e0e0;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.menu-item {
  margin-bottom: 10px;
}

button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 12px;
  background-color: #f5f5f5;
  color: #333;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1em;
  text-align: left;
}

button:hover, button.active {
  background-color: #e0e0e0;
}

.arrow {
  transition: transform 0.3s ease;
}

.arrow.down {
  transform: rotate(90deg);
}

.submenu {
  margin-left: 15%;
  margin-top: 5px;
}

.submenu button {
  background-color: #f0f0f0;
  margin-bottom: 5px;
}

.submenu button:hover {
  background-color: #e0e0e0;
}

.submenu-enter-active,
.submenu-leave-active {
  transition: all 0.3s ease;
  max-height: 100px;
}

.submenu-enter-from,
.submenu-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>