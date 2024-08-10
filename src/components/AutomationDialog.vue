<!-- src/components/AutomationDialog.vue -->
<template>
  <el-dialog v-model="dialogVisible" :title="submenu" width="50%" @close="$emit('close')">
    <el-form :model="info" label-width="120px">
      <el-form-item v-for="field in fields" :key="field.name" :label="field.label">
        <el-input v-model="info[field.name]" :placeholder="field.placeholder"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$emit('close')">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'

const props = defineProps({
  submenu: String,
  fields: Array,
  editingRecord: Object
})

const emit = defineEmits(['close', 'submit'])

const dialogVisible = ref(true)
const info = reactive({})

const resetInfo = () => {
  Object.keys(info).forEach(key => {
    info[key] = ''
  })
}

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
}, { immediate: true })

const submit = () => {
  if (Object.values(info).some(value => value.trim() !== '')) {
    emit('submit', { ...info })
    resetInfo()
    dialogVisible.value = false
  }
}
</script>