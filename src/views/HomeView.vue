<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTopicsStore } from '../stores/counter'

const topicsStore = useTopicsStore()
const predefinedTopics = ref<Array<{name: string, content: string}>>([])

onMounted(async () => {
  // Load predefined topics
  try {
    const talonAlphabet = await import('../assets/exampleTopics/talon_alphabet.yaml?raw')
    predefinedTopics.value = [
      { name: 'Talon Alphabet', content: talonAlphabet.default }
    ]
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
    topicsStore.loadFromYaml(selectedTopic.content)
  }
}
</script>

<template>
  <main class="container">
    <h1>Learn Like K - YAML Topic Loader</h1>
    
    <div v-if="topicsStore.currentTopic" class="topic-name">
      Current Topic: {{ topicsStore.currentTopic.name }}
    </div>

    <div class="form-group">
      <label for="yaml-input">YAML Content:</label>
      <textarea 
        id="yaml-input"
        v-model="topicsStore.yamlText"
        placeholder="Paste your YAML content here..."
        rows="15"
        cols="80"
      ></textarea>
    </div>

    <button @click="loadYaml" class="load-button">Load YAML</button>

    <div v-if="topicsStore.loadError" class="error">
      Error: {{ topicsStore.loadError }}
    </div>

    <div class="predefined-section">
      <label for="predefined-topics">Predefined Topics:</label>
      <select id="predefined-topics" @change="selectPredefinedTopic">
        <option value="">Select a predefined topic...</option>
        <option v-for="topic in predefinedTopics" :key="topic.name" :value="topic.name">
          {{ topic.name }}
        </option>
      </select>
    </div>

    <div v-if="topicsStore.currentTopic" class="topic-info">
      <h3>Topic Information</h3>
      <p><strong>Name:</strong> {{ topicsStore.currentTopic.name }}</p>
      <p v-if="topicsStore.currentTopic.description"><strong>Description:</strong> {{ topicsStore.currentTopic.description }}</p>
      <p><strong>Mode:</strong> {{ topicsStore.currentTopic.mode }}</p>
      <p><strong>Question Sets:</strong> {{ topicsStore.currentTopic.questions.length }}</p>
    </div>
  </main>
</template>

<style scoped>
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.topic-name {
  font-size: 1.2em;
  font-weight: bold;
  margin-bottom: 20px;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: monospace;
  font-size: 14px;
}

.load-button {
  background-color: #3498db;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 15px;
}

.load-button:hover {
  background-color: #2980b9;
}

.error {
  color: #e74c3c;
  background-color: #fdf2f2;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
}

.predefined-section {
  margin-bottom: 20px;
}

select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.topic-info {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
  border-left: 4px solid #3498db;
}

.topic-info h3 {
  margin-top: 0;
  color: #2c3e50;
}

.topic-info p {
  margin: 5px 0;
}
</style>
