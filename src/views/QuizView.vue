<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useTopicsStore } from '../stores/topics'
import { useQuizStore } from '../stores/quiz'
import BottomNav from '../components/BottomNav.vue'

const topicsStore = useTopicsStore()
const quizStore = useQuizStore()
const inputRef = ref<HTMLInputElement>()
const quizAreaRef = ref<HTMLDivElement>()

onMounted(() => {
  if (topicsStore.currentTopic && topicsStore.getActiveQuestions().length > 0) {
    quizStore.startNewQuestion()
    focusInput()
  }
})

async function handleEnter() {
  quizStore.nextQuestion()
  await nextTick()
  focusInput()
}

function focusInput() {
  if (quizStore.showingAnswer) {
    // When showing answer, focus the quiz area so it can receive enter key
    if (quizAreaRef.value) {
      quizAreaRef.value.focus()
    }
  } else {
    // When asking question, focus the input
    if (inputRef.value) {
      inputRef.value.focus()
    }
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
        ref="quizAreaRef"
        class="quiz-area"
        @keyup.enter="handleEnter"
        tabindex="0"
      >
        <div class="question-display">
          <div class="question">{{ quizStore.currentQuestion.question }}</div>
        </div>
        
        <div class="answer-section">
          <input 
            ref="inputRef"
            v-model="quizStore.userAnswer"
            type="text" 
            class="answer-input"
            placeholder="Type your answer and press Enter"
            :disabled="quizStore.showingAnswer"
          />
        </div>
        
        <div v-if="quizStore.showingAnswer" class="answer-feedback">
          <div 
            :class="['correct-answer', quizStore.lastAnswerCorrect ? 'correct' : 'incorrect']"
          >
            {{ quizStore.currentQuestion.answer }}
          </div>
          <div class="next-prompt">Press Enter for next question</div>
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
  outline: none;
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

.answer-feedback {
  text-align: center;
}

.correct-answer {
  font-size: 2em;
  font-weight: bold;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 15px;
}

.correct-answer.correct {
  color: #28a745;
  background-color: #d4edda;
  border: 2px solid #c3e6cb;
}

.correct-answer.incorrect {
  color: #dc3545;
  background-color: #f8d7da;
  border: 2px solid #f5c6cb;
}

.next-prompt {
  color: #6c757d;
  font-style: italic;
}

</style>