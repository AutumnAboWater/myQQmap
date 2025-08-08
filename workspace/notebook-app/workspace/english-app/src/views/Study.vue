<script setup lang="ts">
import { computed, ref } from 'vue'
import { useWordsStore } from '../store/words'

const store = useWordsStore()
const queue = computed(() => store.dueWords)
const current = computed(() => queue.value[0] ?? null)
const showAnswer = ref(false)

function grade(q: 0 | 1 | 2 | 3 | 4 | 5) {
  if (!current.value) return
  store.review(current.value.id, q)
  showAnswer.value = false
}
</script>

<template>
  <div>
    <div v-if="!current">
      <el-empty description="暂无需要复习的单词" />
    </div>
    <div v-else style="max-width:700px">
      <el-card>
        <div style="font-size:28px; font-weight:700">{{ current.term }}</div>
        <div v-if="showAnswer" style="margin-top:12px">
          <div>{{ current.definition }}</div>
          <div v-if="current.example" style="color:var(--el-text-color-secondary); margin-top:8px">{{ current.example }}</div>
        </div>
        <div style="margin-top:16px">
          <el-button v-if="!showAnswer" type="primary" @click="showAnswer = true">显示答案</el-button>
          <div v-else style="display:flex; gap:8px; flex-wrap:wrap">
            <el-button @click="grade(0)">再看</el-button>
            <el-button @click="grade(2)">困难</el-button>
            <el-button type="primary" plain @click="grade(3)">一般</el-button>
            <el-button type="primary" @click="grade(4)">较好</el-button>
            <el-button type="success" @click="grade(5)">很好</el-button>
          </div>
        </div>
      </el-card>
      <div style="margin-top:12px; color:var(--el-text-color-secondary)">队列剩余：{{ queue.length }}</div>
    </div>
  </div>
</template>