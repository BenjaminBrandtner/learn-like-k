import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useTopicsStore } from './topics'

export interface QuizQuestion {
  question: string
  answer: string
}

export const useQuizStore = defineStore('quiz', () => {
  const currentQuestion = ref<QuizQuestion | null>(null)
  const userAnswer = ref('')
  const showingCorrectAnswer = ref(false)
  const showingAnswerAfterEnter = ref(false)

  function getRandomQuestion(): QuizQuestion | null {
    const topicsStore = useTopicsStore()
    const activeQuestions = topicsStore.getActiveQuestions()
    
    if (activeQuestions.length === 0) return null
    
    const randomIndex = Math.floor(Math.random() * activeQuestions.length)
    const questionString = activeQuestions[randomIndex]
    
    return topicsStore.parseQuestionAnswer(questionString)
  }

  function startNewQuestion() {
    const question = getRandomQuestion()
    if (question) {
      currentQuestion.value = question
      userAnswer.value = ''
      showingCorrectAnswer.value = false
      showingAnswerAfterEnter.value = false
    }
  }

  function checkAnswerRealtime() {
    if (!currentQuestion.value) return
    
    const userInput = userAnswer.value.trim().toLowerCase()
    const correctAnswer = currentQuestion.value.answer.trim().toLowerCase()
    
    if (userInput === '') {
      showingCorrectAnswer.value = false
      return
    }
    
    // Check if user input matches the beginning of correct answer
    const isOnRightTrack = correctAnswer.startsWith(userInput)
    
    if (!isOnRightTrack) {
      showingCorrectAnswer.value = true
    } else if (userInput === correctAnswer) {
      // Complete correct answer - auto advance
      setTimeout(() => {
        startNewQuestion()
      }, 0)
    } else {
      showingCorrectAnswer.value = false
    }
  }

  function handleEnterKey() {
    if (showingAnswerAfterEnter.value) {
      // Second enter - show next question
      startNewQuestion()
    } else {
      // First enter - show correct answer
      showingAnswerAfterEnter.value = true
    }
  }

  function resetQuiz() {
    currentQuestion.value = null
    userAnswer.value = ''
    showingCorrectAnswer.value = false
    showingAnswerAfterEnter.value = false
  }

  return {
    currentQuestion,
    userAnswer,
    showingCorrectAnswer,
    showingAnswerAfterEnter,
    startNewQuestion,
    checkAnswerRealtime,
    handleEnterKey,
    resetQuiz
  }
})