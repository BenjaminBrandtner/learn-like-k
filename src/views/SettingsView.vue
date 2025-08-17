<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTopicsStore } from '../stores/topics.ts'
import BottomNav from '../components/BottomNav.vue'
import QuestionSetsTable from '../components/QuestionSetsTable.vue'

const topicsStore = useTopicsStore()
const predefinedTopics = ref<Array<{name: string, content: string}>>([])

onMounted(async () => {
  // Load all predefined topics using Vite's import.meta.glob
  try {
    const topicModules = import.meta.glob('../assets/exampleTopics/*.yaml', { 
      query: '?raw',
      eager: true 
    })
    
    const topics = []
    for (const [path, module] of Object.entries(topicModules)) {
      const filename = path.split('/').pop()?.replace('.yaml', '') || 'Unknown'
      const content = (module as { default: string }).default
      
      // Try to extract the topic name from the YAML content
      try {
        const nameMatch = content.match(/^name:\s*["']?([^"'\n\r]+)["']?/m)
        const displayName = nameMatch ? nameMatch[1] : filename
        topics.push({ name: displayName, content })
      } catch {
        // Fallback to filename if YAML parsing fails
        topics.push({ name: filename, content })
      }
    }
    
    predefinedTopics.value = topics
  } catch (error) {
    console.error('Failed to load predefined topics:', error)
  }
})

function loadYaml() {
  topicsStore.loadFromYaml(topicsStore.yamlText)
}

function selectPredefinedTopic(event: Event) {
  const target = event.target as HTMLSelectElement
  const selectedTopic = predefinedTopics.value.find(topic => topic.name === target.value)
  if (selectedTopic) {
    topicsStore.yamlText = selectedTopic.content
  }
}

function formatDescription(description: string): string {
  // Convert line breaks to HTML <br> tags
  let formatted = description.replace(/\n/g, '<br>')
  
  // Convert URLs to clickable links with Tailwind styling
  const urlRegex = /(https?:\/\/[^\s<>]+)/g
  formatted = formatted.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">$1</a>')
  
  return formatted
}
</script>

<template>
  <main class="max-w-4xl mx-auto px-5 min-h-screen flex flex-col">
    <h1 class="text-2xl font-bold mb-5 text-slate-800">Learn Like K - Settings</h1>
    
    <div v-if="topicsStore.currentTopic" class="text-xl font-bold mb-5 text-slate-600">
      Current Topic: {{ topicsStore.currentTopic.name }}
    </div>

    <div class="mb-4">
      <label for="yaml-input" class="block mb-1 font-bold">Define Topic YAML:</label>
      <textarea 
        id="yaml-input"
        v-model="topicsStore.yamlText"
        placeholder="Paste your YAML content here..."
        rows="15"
        cols="80"
        class="w-full p-2.5 border border-gray-300 rounded font-mono text-sm"
      ></textarea>
    </div>

    <div class="mb-5">
      <label for="predefined-topics" class="block mb-1 font-bold">Or select a predefined topic:</label>
      <select id="predefined-topics" @change="selectPredefinedTopic" class="w-full p-2 border border-gray-300 rounded text-sm">
        <option value="">None selected</option>
        <option v-for="topic in predefinedTopics" :key="topic.name" :value="topic.name">
          {{ topic.name }}
        </option>
      </select>
    </div>

    <div class="flex gap-2.5 mb-4">
      <button @click="loadYaml" class="px-5 py-2.5 border-none rounded cursor-pointer text-base bg-blue-500 text-white hover:bg-blue-600">Load Topic</button>
      <button @click="topicsStore.clearTopic" class="px-5 py-2.5 border-none rounded cursor-pointer text-base bg-red-500 text-white hover:bg-red-600">Clear Topic</button>
    </div>

    <div v-if="topicsStore.loadError" class="text-red-500 bg-red-50 p-2.5 rounded mb-4">
      Error: {{ topicsStore.loadError }}
    </div>


    <div v-if="topicsStore.currentTopic" class="bg-slate-50 p-4 rounded border-l-4 border-blue-500">
      <h3 class="mt-0 text-slate-800 font-bold mb-2">Topic Information</h3>
      <p class="my-1"><strong>Name:</strong> {{ topicsStore.currentTopic.name }}</p>
      <p v-if="topicsStore.currentTopic.description" class="my-1"><strong>Description:</strong> <span v-html="formatDescription(topicsStore.currentTopic.description)"></span></p>
      <p class="my-1"><strong>Mode:</strong> {{ topicsStore.currentTopic.mode }}</p>
      <p class="my-1"><strong>Questions:</strong> {{ topicsStore.currentTopic.questions.length }}</p>
      <p class="my-1"><strong>Active Questions:</strong> {{ topicsStore.getActiveQuestions().length }}</p>
    </div>

    <QuestionSetsTable class="mt-5" />

    <BottomNav />
  </main>
</template>

