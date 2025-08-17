<script setup lang="ts">
import { computed } from 'vue'
import BottomNav from '../components/BottomNav.vue'

const buildTimestamp = computed(() => {
  try {
    // @ts-ignore - Build timestamp is injected at build time
    const timestamp = __BUILD_TIMESTAMP__
    return new Date(timestamp).toLocaleString()
  } catch {
    return 'Unknown'
  }
})
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

      <div class="mb-8">
        <h2 class="text-slate-700 text-xl font-semibold mb-4 pb-1 border-b-2 border-gray-300">Contribute</h2>
        <p class="text-gray-600 mb-4">Want to contribute to Learn Like K? Check out the source code and submit issues or pull requests on GitHub!</p>
        <a 
          href="https://github.com/BenjaminBrandtner/learn-like-k" 
          target="_blank" 
          rel="noopener" 
          class="inline-flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          View on GitHub
        </a>
      </div>

      <div class="mb-8">
        <h2 class="text-slate-700 text-xl font-semibold mb-4 pb-1 border-b-2 border-gray-300">Deployment Info</h2>
        <p class="text-gray-600">
          Last deployed: <span class="font-mono text-gray-800">{{ buildTimestamp }}</span>
        </p>
      </div>
    </div>

    <BottomNav />
  </main>
</template>

