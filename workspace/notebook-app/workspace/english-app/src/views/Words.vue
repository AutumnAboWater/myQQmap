<script setup lang="ts">
import { computed, ref } from 'vue'
import { useWordsStore } from '../store/words'

const store = useWordsStore()
const q = ref(store.keyword)
const tagFilter = ref<string[]>(store.activeTags)

const list = computed(() => store.filtered)
const allTags = computed(() => store.allTags)

const form = ref({ term: '', definition: '', example: '', tags: [] as string[] })
const dialogVisible = ref(false)

function openAdd() {
  dialogVisible.value = true
}

function confirmAdd() {
  if (!form.value.term || !form.value.definition) return
  store.addWord({
    term: form.value.term,
    definition: form.value.definition,
    example: form.value.example,
    tags: form.value.tags,
  })
  form.value = { term: '', definition: '', example: '', tags: [] }
  dialogVisible.value = false
}

function remove(id: string) {
  store.deleteWord(id)
}

function applyFilters() {
  store.setKeyword(q.value)
  store.setActiveTags(tagFilter.value)
}
</script>

<template>
  <div style="display:flex; flex-direction:column; gap:12px">
    <div style="display:flex; gap:8px">
      <el-input v-model="q" placeholder="搜索词/释义" clearable @change="applyFilters" style="width:260px" />
      <el-select v-model="tagFilter" multiple clearable filterable placeholder="标签" @change="applyFilters" style="min-width:240px">
        <el-option v-for="t in allTags" :key="t" :label="t" :value="t" />
      </el-select>
      <el-button type="primary" @click="openAdd">新增单词</el-button>
    </div>

    <el-table :data="list" style="width: 100%">
      <el-table-column prop="term" label="单词" width="200" />
      <el-table-column prop="definition" label="释义" />
      <el-table-column label="标签" width="240">
        <template #default="{ row }">
          <el-tag v-for="t in row.tags" :key="t" style="margin-right:6px">{{ t }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140">
        <template #default="{ row }">
          <el-button type="danger" text @click="remove(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" title="新增单词" width="600">
      <el-form label-width="80px">
        <el-form-item label="单词"><el-input v-model="form.term" /></el-form-item>
        <el-form-item label="释义"><el-input v-model="form.definition" /></el-form-item>
        <el-form-item label="例句"><el-input v-model="form.example" type="textarea" /></el-form-item>
        <el-form-item label="标签">
          <el-select v-model="form.tags" multiple filterable allow-create default-first-option placeholder="选择或输入标签" style="width:100%">
            <el-option v-for="t in allTags" :key="t" :label="t" :value="t" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAdd">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>