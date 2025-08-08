<script setup lang="ts">
import { computed, ref } from 'vue'
import { useNotesStore } from '../store/notes'
import { ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

const store = useNotesStore()
const search = ref(store.keyword)

const tags = computed(() => store.allTags)
const active = ref<string[]>(store.activeTags)

function onCreate() {
  store.createNote()
}

function onRemoveTag(tag: string) {
  ElMessageBox.confirm(`删除筛选标签 “${tag}” ?`, '确认', { type: 'warning' })
    .then(() => {
      active.value = active.value.filter(t => t !== tag)
      store.setActiveTags(active.value)
    })
    .catch(() => {})
}

function applySearch() {
  store.setKeyword(search.value)
}

function applyTags() {
  store.setActiveTags(active.value)
}
</script>

<template>
  <div style="padding: 12px; display:flex; flex-direction: column; gap:12px">
    <el-button type="primary" @click="onCreate" block>新建笔记</el-button>

    <el-input v-model="search" placeholder="搜索标题或内容" clearable @change="applySearch">
      <template #prefix>
        <el-icon><Search /></el-icon>
      </template>
    </el-input>

    <div>
      <div style="font-size:12px;color:var(--el-text-color-secondary);margin-bottom:6px">标签筛选</div>
      <el-select v-model="active" multiple filterable clearable placeholder="选择标签" @change="applyTags" style="width:100%">
        <el-option v-for="t in tags" :key="t" :label="t" :value="t" />
      </el-select>
      <div style="margin-top:8px; display:flex; flex-wrap: wrap; gap:6px">
        <el-tag v-for="t in active" :key="t" closable @close="onRemoveTag(t)">{{ t }}</el-tag>
      </div>
    </div>
  </div>
</template>