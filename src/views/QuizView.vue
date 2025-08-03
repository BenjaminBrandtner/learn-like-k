<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useTopicsStore } from '../stores/topics'
import { useQuizStore } from '../stores/quiz'
import BottomNav from '../components/BottomNav.vue'

const topicsStore = useTopicsStore()
const quizStore = useQuizStore()
const inputRef = ref<HTMLInputElement>()

onMounted(() => {
  if (topicsStore.currentTopic && topicsStore.getActiveQuestions().length > 0) {
    quizStore.startNewQuestion()
    focusInput()
  }
})

function handleEnter() {
  quizStore.handleEnterKey()
}

function handleInput() {
  quizStore.checkAnswerRealtime()
}

function focusInput() {
  if (inputRef.value) {
    inputRef.value.focus()
  }
}
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
      
      <div 
        v-if="quizStore.currentQuestion" 
        class="quiz-area"
      >
        <div class="question-display">
          <div class="question">{{ quizStore.currentQuestion.question }}</div>
        </div>
        
        <div class="answer-hint">
          <div 
            v-if="quizStore.showingCorrectAnswer || quizStore.showingAnswerAfterEnter"
            class="correct-answer-hint">
            {{ quizStore.currentQuestion.answer }}
          </div>
        </div>
        
        <div class="answer-section">
          <input 
            ref="inputRef"
            v-model="quizStore.userAnswer"
            type="text" 
            class="answer-input"
            @input="handleInput"
            @keyup.enter="handleEnter"
          />
        </div>
        
        <div v-if="quizStore.showingAnswerAfterEnter" class="next-prompt">
          Press Enter for next question
        </div>
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

.quiz-area {
  max-width: 600px;
  margin: 0 auto;
}

.question-display {
  text-align: center;
  margin-bottom: 40px;
}

.question {
  font-size: 3em;
  font-weight: bold;
  color: #2c3e50;
  padding: 30px;
  background-color: #f8f9fa;
  border-radius: 12px;
  border: 2px solid #dee2e6;
}

.answer-section {
  margin-bottom: 30px;
}

.answer-input {
  width: 100%;
  font-size: 1.5em;
  padding: 15px 20px;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  text-align: center;
  outline: none;
  transition: border-color 0.2s ease;
}

.answer-input:focus {
  border-color: #3498db;
}

.answer-input:disabled {
  background-color: #f8f9fa;
  color: #6c757d;
}

.answer-hint {
  text-align: center;
  margin-bottom: 20px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.correct-answer-hint {
  font-size: 1.5em;
  font-weight: bold;
  padding: 15px 20px;
  border-radius: 8px;
  color: #dc3545;
  background-color: #f8d7da;
  border: 2px solid #f5c6cb;
}

.next-prompt {
  color: #6c757d;
  font-style: italic;
}

</style>