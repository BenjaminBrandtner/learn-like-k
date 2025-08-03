<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTopicsStore } from '../stores/topics.ts'

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
      <p><strong>Active Questions:</strong> {{ topicsStore.getActiveQuestions().length }}</p>
    </div>

    <div v-if="topicsStore.currentTopic" class="question-sets">
      <h3>Question Sets</h3>
      <table class="sets-table">
        <thead>
          <tr>
            <th class="toggle-col">Enable</th>
            <th class="set-col">Set</th>
            <th class="questions-col">Questions → Answers</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="(set, index) in topicsStore.getParsedQuestionSets()" 
            :key="index"
            :class="{ 'disabled-set': !topicsStore.enabledSets[index] }"
            class="set-row"
            @click="topicsStore.toggleSet(index)"
          >
            <td class="toggle-cell">
              <input 
                type="checkbox" 
                :checked="topicsStore.enabledSets[index]"
                @change="topicsStore.toggleSet(index)"
                @click.stop
              />
            </td>
            <td class="set-cell">
              <strong>Set {{ index + 1 }}</strong>
              <div class="set-count">{{ set.length }} questions</div>
            </td>
            <td class="questions-cell">
              <div class="question-pairs">
                <span 
                  v-for="(qa, qaIndex) in set" 
                  :key="qaIndex" 
                  class="question-pair"
                >
                  <strong>{{ qa.question }}</strong> → {{ qa.answer }}
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
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

.question-sets {
  margin-top: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 4px;
  border-left: 4px solid #28a745;
}

.question-sets h3 {
  margin-top: 0;
  color: #2c3e50;
}

.sets-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  background: white;
  border-radius: 4px;
  overflow: hidden;
}

.sets-table th {
  background-color: #e9ecef;
  padding: 12px;
  text-align: left;
  font-weight: bold;
  color: #2c3e50;
  border-bottom: 2px solid #dee2e6;
}

.sets-table td {
  padding: 12px;
  border-bottom: 1px solid #dee2e6;
  vertical-align: top;
}

.set-row {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.set-row:hover {
  background-color: #f8f9fa;
}

.toggle-col {
  width: 80px;
}

.set-col {
  width: 120px;
}

.questions-col {
  width: auto;
}

.toggle-cell {
  text-align: center;
}

.toggle-cell input[type="checkbox"] {
  transform: scale(1.3);
}

.set-cell {
  font-weight: bold;
}

.set-count {
  font-size: 0.85em;
  color: #666;
  font-weight: normal;
  margin-top: 4px;
}

.question-pairs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.question-pair {
  background: #f8f9fa;
  padding: 4px 8px;
  border-radius: 3px;
  font-size: 0.9em;
  border: 1px solid #e9ecef;
}

.disabled-set {
  opacity: 0.6;
}

.disabled-set .question-pair {
  background: #f5f5f5;
  color: #999;
}
</style>
