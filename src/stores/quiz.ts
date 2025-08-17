import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useTopicsStore, type Question } from './topics'

export const useQuizStore = defineStore('quiz', () => {
  const currentQuestion = ref<Question | null>(null)
  const userAnswer = ref('')
  const showingCorrectAnswer = ref(false)
  const showingAnswerAfterEnter = ref(false)
  
  // Question frequency tracking for equal distribution
  const questionUsageCount = ref<Map<string, number>>(new Map())

  function getQuestionKey(question: Question): string {
    return `${question.question}:${question.answer}`
  }

  function getSmartQuestion(): Question | null {
    const topicsStore = useTopicsStore()
    const activeQuestions = topicsStore.getActiveQuestions()
    
    if (activeQuestions.length === 0) return null
    if (activeQuestions.length === 1) return activeQuestions[0]
    
    // Create pool of questions excluding the current one shown
    const availableQuestions = activeQuestions.filter(q => 
      !currentQuestion.value || getQuestionKey(q) !== getQuestionKey(currentQuestion.value)
    )
    
    // Find the minimum usage count among available questions
    const minUsageCount = Math.min(
      ...availableQuestions.map(q => questionUsageCount.value.get(getQuestionKey(q)) || 0)
    )
    
    // Get all questions at the minimum usage level
    const leastUsedQuestions = availableQuestions.filter(q => 
      (questionUsageCount.value.get(getQuestionKey(q)) || 0) === minUsageCount
    )
    
    // Random selection from least used questions
    const randomIndex = Math.floor(Math.random() * leastUsedQuestions.length)
    return leastUsedQuestions[randomIndex]
  }

  function startNewQuestion() {
    const question = getSmartQuestion()
    if (question) {
      // Update usage tracking
      const key = getQuestionKey(question)
      const currentCount = questionUsageCount.value.get(key) || 0
      questionUsageCount.value.set(key, currentCount + 1)
      
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

  // Function is called when changing which questions are enabled
  function validateCurrentQuestion() {
    const topicsStore = useTopicsStore()
    const activeQuestions = topicsStore.getActiveQuestions()
    
    resetUsageTracking()
    
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

  function resetUsageTracking() {
    questionUsageCount.value.clear()
  }

  return {
    currentQuestion,
    userAnswer,
    showingCorrectAnswer,
    showingAnswerAfterEnter,
    startNewQuestion,
    checkAnswerRealtime,
    handleEnterKey,
    validateCurrentQuestion,
  }
})