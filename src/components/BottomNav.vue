<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

function isActive(path: string): boolean {
  if (path === '/') {
    return route.path === '/' || route.path === '/quiz'
  }
  return route.path === path
}
</script>

<template>
  <nav class="bottom-nav">
    <router-link to="/quiz" :class="['nav-link', { active: isActive('/') }]">
      Quiz
    </router-link>
    <router-link to="/settings" :class="['nav-link', { active: isActive('/settings') }]">
      Settings
    </router-link>
    <router-link to="/about" :class="['nav-link', { active: isActive('/about') }]">
      About
    </router-link>
  </nav>
</template>

<style scoped>
.bottom-nav {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 20px 0;
  border-top: 1px solid #dee2e6;
  margin-top: auto;
}

.nav-link {
  padding: 12px 24px;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s ease;
  color: #6c757d;
  background-color: #f8f9fa;
}

.nav-link:hover {
  background-color: #e9ecef;
  color: #495057;
}

.nav-link.active {
  background-color: #3498db;
  color: white;
}

.nav-link.active:hover {
  background-color: #2980b9;
}
</style>