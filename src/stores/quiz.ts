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
  const showingAnswer = ref(false)
  const lastAnswerCorrect = ref<boolean | null>(null)

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
      showingAnswer.value = false
      lastAnswerCorrect.value = null
    }
  }

  function checkAnswer() {
    if (!currentQuestion.value) return
    
    const userAnswerTrimmed = userAnswer.value.trim().toLowerCase()
    const correctAnswer = currentQuestion.value.answer.trim().toLowerCase()
    
    // Empty answer counts as correct
    const isCorrect = userAnswerTrimmed === '' || userAnswerTrimmed === correctAnswer
    
    lastAnswerCorrect.value = isCorrect
    showingAnswer.value = true
  }

  function nextQuestion() {
    if (showingAnswer.value) {
      startNewQuestion()
    } else {
      checkAnswer()
    }
  }

  function resetQuiz() {
    currentQuestion.value = null
    userAnswer.value = ''
    showingAnswer.value = false
    lastAnswerCorrect.value = null
  }

  return {
    currentQuestion,
    userAnswer,
    showingAnswer,
    lastAnswerCorrect,
    startNewQuestion,
    checkAnswer,
    nextQuestion,
    resetQuiz
  }
})