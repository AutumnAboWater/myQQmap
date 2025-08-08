<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useNotesStore } from '../store/notes'
import { useRouter } from 'vue-router'

const store = useNotesStore()
const router = useRouter()

const selected = computed(() => store.selectedNote)
const title = ref(selected.value?.title ?? '')

watch(selected, (n) => {
  title.value = n?.title ?? ''
})

function onTitleChange() {
  if (!selected.value) return
  store.updateNote(selected.value.id, { title: title.value })
}

function onDelete() {
  const id = selected.value?.id
  if (!id) return
  store.deleteNote(id)
  if (store.selectedNoteId) {
    router.push({ name: 'note', params: { id: store.selectedNoteId } })
  } else {
    router.push({ name: 'home' })
  }
}
</script>

<template>
  <div style="display:flex; gap:12px; width:100%; align-items:center">
    <el-input v-model="title" placeholder="输入标题" @change="onTitleChange" />
    <el-button type="danger" plain @click="onDelete" :disabled="!selected">删除</el-button>
  </div>
</template>