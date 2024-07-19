<template>
  <div class="sidebar">
    <h2>侧边栏</h2>
    <div class="menu-item">
      <button @click="toggleSubmenu" :class="{ active: showSubmenu }">
        <span>主选项</span>
        <span class="arrow" :class="{ down: showSubmenu }">▶</span>
      </button>
      <transition name="submenu">
        <div v-if="showSubmenu" class="submenu">
          <button @click="$emit('add-record', '子菜单1')">子菜单1</button>
          <button @click="$emit('add-record', '子菜单2')">子菜单2</button>
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
  width: 220px;
  background-color: #34495e;
  padding: 20px;
  color: white;
  overflow-y: auto;
  flex-shrink: 0;
}

h2 {
  margin-top: 0;
  font-weight: 500;
  font-size: 1.5em;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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
  background-color: #2c3e50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1em;
  text-align: left;
}

button:hover, button.active {
  background-color: #2980b9;
}

.arrow {
  transition: transform 0.3s ease;
}

.arrow.down {
  transform: rotate(90deg);
}

.submenu {
  margin-left: 20px;
  margin-top: 5px;
}

.submenu button {
  background-color: #3498db;
  margin-bottom: 5px;
}

.submenu button:hover {
  background-color: #2980b9;
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
