<!-- DialogBox.vue -->
<template>
  <el-dialog v-model="dialogVisible" :title="submenu" width="50%" @close="$emit('close')">
    <el-form :model="info" label-width="120px" :rules="formRules" ref="formRef">
      <el-form-item v-for="field in fields" :key="field.name" :label="field.label" :prop="field.name">
        <el-input v-if="!field.type || field.type === 'text'" v-model="info[field.name]"
          :placeholder="field.placeholder"></el-input>
        <el-select v-else-if="field.type === 'select'" v-model="info[field.name]" :placeholder="field.placeholder">
          <el-option v-for="option in field.options" :key="option.value" :label="option.label"
            :value="option.value"></el-option>
        </el-select>
        <el-checkbox v-else-if="field.type === 'checkbox'" v-model="info[field.name]">{{ field.label }}</el-checkbox>
        <el-upload v-else-if="field.type === 'file'" :action="uploadUrl" :on-success="handleFileUploadSuccess"
          :on-error="handleFileUploadError" :accept="field.accept">
          <el-button type="primary">上传文件</el-button>
        </el-upload>
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
import { ref, reactive, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  submenu: String,
  fields: Array,
  editingRecord: Object
})

const emit = defineEmits(['close', 'submit'])

const dialogVisible = ref(true)
const info = reactive({})
const formRef = ref(null)

const formRules = computed(() => {
  const rules = {}
  props.fields.forEach(field => {
    if (field.rules) {
      rules[field.name] = field.rules
    }
  })
  return rules
})

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

const submit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    emit('submit', { ...info })
    resetInfo()
    dialogVisible.value = false
  } catch (error) {
    console.error('Validation failed:', error)
    ElMessage.error('请检查输入是否正确')
  }
}

const handleFileUploadSuccess = (response, file) => {
  info[file.raw.name] = response.filePath
}

const handleFileUploadError = (error) => {
  console.error('File upload failed:', error)
  ElMessage.error('文件上传失败')
}

// 这里需要定义上传URL，你可能需要根据你的后端API来设置
const uploadUrl = 'http://your-api-url/upload'
</script>