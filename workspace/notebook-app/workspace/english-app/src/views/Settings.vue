<script setup lang="ts">
import { useWordsStore } from '../store/words'

const store = useWordsStore()

function exportJson() {
  const blob = new Blob([JSON.stringify(store.words, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'words.json'
  a.click()
  URL.revokeObjectURL(url)
}

function onImport(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    try {
      const data = JSON.parse(String(reader.result))
      if (Array.isArray(data)) {
        // naive merge replace
        // @ts-ignore
        store.words = data
      }
    } catch (e) {
      console.error(e)
    }
  }
  reader.readAsText(file)
}
</script>

<template>
  <div style="display:flex; gap:12px; align-items:center">
    <el-button type="primary" @click="exportJson">导出 JSON</el-button>
    <el-upload :auto-upload="false" accept="application/json" :show-file-list="false" @change="onImport">
      <el-button>导入 JSON</el-button>
    </el-upload>
  </div>
</template>