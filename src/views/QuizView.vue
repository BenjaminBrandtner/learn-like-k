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


function focusInput() {
  if (inputRef.value) {
    inputRef.value.focus()
  }
}
</script>

<template>
  <div class="w-full flex justify-center">
    <main class="w-full max-w-4xl p-5 min-h-screen flex flex-col">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Learn Like K - Quiz</h1>
    
    <div v-if="!topicsStore.currentTopic" class="flex-1 flex flex-col justify-center items-center text-center">
      <p class="text-gray-600 mb-5">No topic loaded. Please go to Settings to load a topic first.</p>
      <router-link to="/settings" class="inline-block mt-5 px-5 py-2.5 bg-blue-500 text-white no-underline rounded hover:bg-blue-600 transition-colors">Go to Settings</router-link>
    </div>

    <div v-else-if="topicsStore.getActiveQuestions().length === 0" class="flex-1 flex flex-col justify-center items-center text-center">
      <p class="text-gray-600 mb-5">No question sets are enabled. Please go to Settings to enable some question sets.</p>
      <router-link to="/settings" class="inline-block mt-5 px-5 py-2.5 bg-blue-500 text-white no-underline rounded hover:bg-blue-600 transition-colors">Go to Settings</router-link>
    </div>

    <div v-else class="flex-1 flex flex-col">
      <div class="text-center mb-12">
        <h2 class="text-xl font-semibold text-gray-800 mb-2">{{ topicsStore.currentTopic.name }}</h2>
        <p class="text-gray-600">{{ topicsStore.getActiveQuestions().length }} questions ready</p>
      </div>
      
      <div 
        v-if="quizStore.currentQuestion" 
        class="mt-4"
      >
        <div class="text-center mb-12">
          <div class="text-5xl font-bold text-gray-800 p-7 bg-gray-50 rounded-xl border-2 border-gray-200">{{ quizStore.currentQuestion.question }}</div>
        </div>
        
        <div class="text-center mb-5 h-20 flex items-center justify-center">
          <div 
            v-if="quizStore.showingCorrectAnswer || quizStore.showingAnswerAfterEnter"
            class="text-2xl font-bold px-5 py-4 rounded-lg text-red-600 bg-red-50 border-2 border-red-200">
            {{ quizStore.currentQuestion.answer }}
          </div>
        </div>
        
        <div class="mb-7">
          <input 
            ref="inputRef"
            v-model="quizStore.userAnswer"
            type="text" 
            class="w-full text-2xl px-5 py-4 border-2 border-gray-200 rounded-lg text-center outline-none transition-colors focus:border-blue-500"
            @input="quizStore.checkAnswerRealtime"
            @keyup.enter="quizStore.handleEnterKey"
          />
        </div>
        
        <div v-if="quizStore.showingAnswerAfterEnter" class="text-center text-gray-500 italic">
          Press Enter for next question
        </div>
      </div>
    </div>

    <BottomNav />
    </main>
  </div>
</template>