<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useNotesStore } from '../store/notes'
import { useRoute, useRouter } from 'vue-router'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

const store = useNotesStore()
const route = useRoute()
const router = useRouter()

const notes = computed(() => store.filteredNotes)
const selectedId = computed({
  get: () => store.selectedNoteId,
  set: (v) => store.selectNote(v),
})

watch(notes, (list) => {
  if (!list.find(n => n.id === selectedId.value)) {
    selectedId.value = list[0]?.id ?? null
  }
})

watch(() => route.params.id, (id) => {
  if (typeof id === 'string') {
    selectedId.value = id
  }
}, { immediate: true })

watch(selectedId, (id) => {
  if (id) router.replace({ name: 'note', params: { id } })
})

const content = ref(store.selectedNote?.content ?? '')
const tagsInput = ref('')

watch(() => store.selectedNote, (n) => {
  content.value = n?.content ?? ''
}, { immediate: true })

function onContentInput() {
  const id = selectedId.value
  if (!id) return
  store.updateNote(id, { content: content.value })
}

function addTag() {
  const tag = tagsInput.value.trim()
  if (!tag) return
  store.addTagToSelected(tag)
  tagsInput.value = ''
}

function removeTag(tag: string) {
  store.removeTagFromSelected(tag)
}

const renderer = new marked.Renderer()
marked.setOptions({ breaks: true })

const html = computed(() => {
  const raw = marked.parse(content.value, { renderer }) as string
  return DOMPurify.sanitize(raw)
})
</script>

<template>
  <div style="display:flex; gap:12px; height:100%;">
    <div style="width:280px; border-right:1px solid var(--el-border-color); padding-right:12px">
      <el-scrollbar height="calc(100vh - 56px)">
        <el-empty v-if="notes.length === 0" description="暂无笔记" />
        <el-menu :default-active="selectedId ?? undefined" @select="(i: string) => selectedId = i" style="border:none">
          <el-menu-item v-for="n in notes" :key="n.id" :index="n.id">
            <div style="display:flex; flex-direction:column">
              <div style="font-weight:600; max-width:220px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap">{{ n.title }}</div>
              <div style="font-size:12px; color: var(--el-text-color-secondary)">{{ new Date(n.updatedAt).toLocaleString() }}</div>
            </div>
          </el-menu-item>
        </el-menu>
      </el-scrollbar>
    </div>

    <div style="flex:1; display:flex; gap:12px">
      <div style="flex:1; display:flex; flex-direction:column; gap:8px">
        <div>
          <el-input v-model="tagsInput" placeholder="输入标签后回车" @keyup.enter="addTag" clearable />
          <div style="margin-top:8px; display:flex; flex-wrap:wrap; gap:6px">
            <el-tag v-for="t in store.selectedNote?.tags ?? []" :key="t" closable @close="removeTag(t)">{{ t }}</el-tag>
          </div>
        </div>
        <el-input
          v-model="content"
          type="textarea"
          :rows="20"
          placeholder="在这里书写 Markdown..."
          @input="onContentInput"
        />
      </div>
      <div style="flex:1; border-left:1px solid var(--el-border-color); padding-left:12px; overflow:auto">
        <div v-html="html" style="padding:0 8px"></div>
      </div>
    </div>
  </div>
</template>