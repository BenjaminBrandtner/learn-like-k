import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useTopicsStore, type Question } from './topics'

export const useQuizStore = defineStore('quiz', () => {
  const currentQuestion = ref<Question | null>(null)
  const userAnswer = ref('')
  const showingCorrectAnswer = ref(false)
  const showingAnswerAfterEnter = ref(false)

  function getRandomQuestion(): Question | null {
    const topicsStore = useTopicsStore()
    const activeQuestions = topicsStore.getActiveQuestions()
    
    if (activeQuestions.length === 0) return null
    
    const randomIndex = Math.floor(Math.random() * activeQuestions.length)
    return activeQuestions[randomIndex]
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

  function isCurrentQuestionFromActiveSet(): boolean {
    if (!currentQuestion.value) return false
    
    const topicsStore = useTopicsStore()
    const activeQuestions = topicsStore.getActiveQuestions()
    
    // Check if current question exists in active questions
    return activeQuestions.some(question => 
      question.question === currentQuestion.value?.question && 
      question.answer === currentQuestion.value?.answer
    )
  }

  function validateCurrentQuestion() {
    const topicsStore = useTopicsStore()
    const activeQuestions = topicsStore.getActiveQuestions()
    
    // If no sets are active, clear current question
    if (activeQuestions.length === 0) {
      currentQuestion.value = null
      userAnswer.value = ''
      showingCorrectAnswer.value = false
      showingAnswerAfterEnter.value = false
      return
    }
    
    // If no current question but we have active questions, start a new one
    if (!currentQuestion.value) {
      startNewQuestion()
      return
    }
    
    // If current question is from a deselected set, generate a new one
    if (!isCurrentQuestionFromActiveSet()) {
      startNewQuestion()
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
    resetQuiz,
    validateCurrentQuestion
  }
})