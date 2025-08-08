<script setup lang="ts">
</script>

<template>
  <el-container style="height: 100vh">
    <el-aside width="220px" style="border-right:1px solid var(--el-border-color)">
      <el-menu router default-active="/dashboard">
        <el-menu-item index="/dashboard">仪表盘</el-menu-item>
        <el-menu-item index="/study">学习</el-menu-item>
        <el-menu-item index="/words">单词管理</el-menu-item>
        <el-menu-item index="/settings">设置</el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header height="56px" style="display:flex; align-items:center; padding:0 16px; border-bottom:1px solid var(--el-border-color)">
        <div style="font-weight:600">Learn English</div>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
</style>
