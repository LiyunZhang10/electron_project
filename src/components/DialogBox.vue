<!-- DialogBox.vue -->
<template>
  <Transition name="dialog">
    <div class="dialog-overlay" @click.self="$emit('close')">
      <div class="dialog-box">
        <h3>{{ submenu }}</h3>
        <div v-for="field in fields" :key="field.name" class="info-input">
          <label :for="field.name">{{ field.label }}:</label>
          <input
            :id="field.name"
            v-model="info[field.name]"
            :placeholder="field.placeholder"
          />
        </div>
        <div class="dialog-buttons">
          <button @click="$emit('close')" class="cancel">取消</button>
          <button @click="submit" class="submit">确定</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { reactive, onMounted, watch } from 'vue'

const props = defineProps({
  submenu: String,
  fields: Array,
  editingRecord: Object
})

const emit = defineEmits(['close', 'submit'])

const info = reactive({})

const resetInfo = () => {
  Object.keys(info).forEach(key => {
    info[key] = ''
  })
}

onMounted(() => {
  if (props.editingRecord) {
    Object.keys(props.editingRecord).forEach(key => {
      if (key !== 'id' && key !== 'type') {
        info[key] = props.editingRecord[key]
      }
    })
  } else {
    resetInfo()
  }
})

watch(() => props.editingRecord, (newVal) => {
  if (newVal) {
    Object.keys(newVal).forEach(key => {
      if (key !== 'id' && key !== 'type') {
        info[key] = newVal[key]
      }
    })
  } else {
    resetInfo()
  }
})

const submit = () => {
  if (Object.values(info).some(value => value.trim() !== '')) {
    emit('submit', { ...info })
    resetInfo()
  }
}
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dialog-box {
  background-color: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 400px;
  max-width: 90%;
}

h3 {
  margin-top: 0;
  color: #2c3e50;
  font-weight: 500;
  font-size: 1.4em;
  margin-bottom: 20px;
}

.info-input {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #2c3e50;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

input:focus {
  outline: none;
  border-color: #3498db;
}

.dialog-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.cancel {
  background-color: #e74c3c;
  color: white;
  margin-right: 15px;
}

.submit {
  background-color: #2ecc71;
  color: white;
}

.cancel:hover {
  background-color: #c0392b;
}

.submit:hover {
  background-color: #27ae60;
}

.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>