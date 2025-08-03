<script setup lang="ts">
import { useTopicsStore } from '../stores/topics'
import BottomNav from '../components/BottomNav.vue'

const topicsStore = useTopicsStore()
</script>

<template>
  <main class="container">
    <h1>Learn Like K - Quiz</h1>
    
    <div v-if="!topicsStore.currentTopic" class="no-topic">
      <p>No topic loaded. Please go to Settings to load a topic first.</p>
      <router-link to="/settings" class="settings-link">Go to Settings</router-link>
    </div>

    <div v-else-if="topicsStore.getActiveQuestions().length === 0" class="no-questions">
      <p>No question sets are enabled. Please go to Settings to enable some question sets.</p>
      <router-link to="/settings" class="settings-link">Go to Settings</router-link>
    </div>

    <div v-else class="quiz-ready">
      <div class="topic-info">
        <h2>{{ topicsStore.currentTopic.name }}</h2>
        <p>{{ topicsStore.getActiveQuestions().length }} questions ready</p>
      </div>
      
      <div class="quiz-placeholder">
        <p>Quiz implementation coming soon...</p>
      </div>
    </div>

    <BottomNav />
  </main>
</template>

<style scoped>
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.no-topic, .no-questions {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.settings-link {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}

.settings-link:hover {
  background-color: #2980b9;
}

.quiz-ready {
  flex: 1;
}

.topic-info {
  text-align: center;
  margin-bottom: 30px;
}

.topic-info h2 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.quiz-placeholder {
  text-align: center;
  padding: 50px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 2px dashed #dee2e6;
}

</style>