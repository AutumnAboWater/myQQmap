<script setup lang="ts">
import { computed } from 'vue'
import { useWordsStore } from '../store/words'

const store = useWordsStore()
const total = computed(() => store.words.length)
const due = computed(() => store.dueWords.length)
</script>

<template>
  <div style="display:flex; gap:16px; flex-wrap:wrap">
    <el-card style="width:240px">
      <div>单词总数</div>
      <div style="font-size:28px; font-weight:700">{{ total }}</div>
    </el-card>
    <el-card style="width:240px">
      <div>待复习</div>
      <div style="font-size:28px; font-weight:700">{{ due }}</div>
    </el-card>
    <div style="align-self:center">
      <el-button type="primary" @click="$router.push('/study')">开始学习</el-button>
      <el-button @click="$router.push('/words')">管理单词</el-button>
    </div>
  </div>
</template>