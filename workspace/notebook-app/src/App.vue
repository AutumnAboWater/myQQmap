<script setup lang="ts">
</script>

<template>
  <el-container style="height: 100vh">
    <el-aside width="260px" style="border-right: 1px solid var(--el-border-color)">
      <router-view name="sidebar" />
    </el-aside>
    <el-container>
      <el-header height="56px" style="border-bottom: 1px solid var(--el-border-color); display:flex; align-items:center; padding:0 16px">
        <router-view name="header" />
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
</style>
