<script setup lang="ts">
import BottomNav from '../components/BottomNav.vue'
</script>

<template>
  <main class="max-w-4xl mx-auto p-5 min-h-screen flex flex-col">
    <div class="flex-1">
      <h1 class="text-slate-700 text-3xl font-bold mb-5">About Learn Like K</h1>
      <p class="text-lg leading-relaxed text-gray-600 mb-8">A simple rote memorization learning tool inspired by Japanese kana learning applications, specifically <a href="https://kenrick95.github.io/itazuraneko/learn/kana.html" target="_blank" rel="noopener" class="text-blue-600 hover:text-blue-800 underline">Itazuraneko's kana learning tool</a>.</p>
      
      <div class="mb-8">
        <h2 class="text-slate-700 text-xl font-semibold mb-4 pb-1 border-b-2 border-gray-300">Features</h2>
        <ul class="list-none p-0">
          <li class="py-2 border-b border-gray-200 last:border-b-0"><strong class="text-gray-800">YAML Topic Loading</strong> - Define your own question sets or use predefined topics</li>
          <li class="py-2 border-b border-gray-200 last:border-b-0"><strong class="text-gray-800">Flexible Question Sets</strong> - Enable/disable specific sets of questions</li>
          <li class="py-2 border-b border-gray-200 last:border-b-0"><strong class="text-gray-800">Persistent Settings</strong> - Your topic and preferences are saved automatically</li>
          <li class="py-2 border-b border-gray-200 last:border-b-0"><strong class="text-gray-800">Static Hosting</strong> - Runs entirely in your browser, no server needed</li>
        </ul>
      </div>

      <div class="mb-8">
        <h2 class="text-slate-700 text-xl font-semibold mb-4 pb-1 border-b-2 border-gray-300">Built With</h2>
        <ul class="list-none p-0">
          <li class="py-2 border-b border-gray-200 last:border-b-0">Vue 3 + TypeScript</li>
          <li class="py-2 border-b border-gray-200 last:border-b-0">Vite for build tooling</li>
          <li class="py-2 border-b border-gray-200 last:border-b-0">Pinia for state management</li>
          <li class="py-2 border-b border-gray-200 last:border-b-0">js-yaml for YAML parsing</li>
          <li class="py-2 border-b border-gray-200 last:border-b-0">Claude Code for AI-assisted development</li>
        </ul>
      </div>
    </div>

    <BottomNav />
  </main>
</template>

