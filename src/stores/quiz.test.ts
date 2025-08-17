import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useQuizStore } from './quiz'
import { useTopicsStore } from './topics'

describe('Quiz Store - Smart Question Selection', () => {
  beforeEach(() => {
    // Create a fresh Pinia instance for each test
    setActivePinia(createPinia())
  })

  it('should prevent consecutive duplicate questions', () => {
    const quizStore = useQuizStore()
    const topicsStore = useTopicsStore()
    
    // Load test topic with multiple questions
    topicsStore.loadFromYaml(`
name: Test Topic
questions:
  - - "A: apple"
    - "B: banana" 
    - "C: cherry"
`)
    
    // Start first question
    quizStore.startNewQuestion()
    const firstQuestion = quizStore.currentQuestion
    expect(firstQuestion).toBeTruthy()
    
    // Get next question - should be different
    quizStore.startNewQuestion()
    const secondQuestion = quizStore.currentQuestion
    expect(secondQuestion).toBeTruthy()
    expect(secondQuestion?.question).not.toBe(firstQuestion?.question)
  })

  it('should ensure equal distribution over time', () => {
    const quizStore = useQuizStore()
    const topicsStore = useTopicsStore()
    
    // Load test topic with 3 questions
    topicsStore.loadFromYaml(`
name: Test Topic  
questions:
  - - "A: apple"
    - "B: banana"
    - "C: cherry"
`)
    
    // Track question appearances
    const questionCount = new Map<string, number>()
    
    // Generate many questions to test distribution
    for (let i = 0; i < 30; i++) {
      quizStore.startNewQuestion()
      const question = quizStore.currentQuestion?.question
      if (question) {
        questionCount.set(question, (questionCount.get(question) || 0) + 1)
      }
    }
    
    // Each question should appear roughly equally (within 3 questions of each other)
    const counts = Array.from(questionCount.values())
    const maxCount = Math.max(...counts)
    const minCount = Math.min(...counts)
    expect(maxCount - minCount).toBeLessThanOrEqual(3)
  })

  it('should handle single question gracefully', () => {
    const quizStore = useQuizStore()
    const topicsStore = useTopicsStore()
    
    // Load topic with only one question
    topicsStore.loadFromYaml(`
name: Single Question
questions:
  - - "A: apple"
`)
    
    // Should return the same question every time
    quizStore.startNewQuestion()
    const firstQuestion = quizStore.currentQuestion
    expect(firstQuestion?.question).toBe('A')
    
    quizStore.startNewQuestion()
    const secondQuestion = quizStore.currentQuestion
    expect(secondQuestion?.question).toBe('A')
  })

  it('should handle empty question sets', () => {
    const quizStore = useQuizStore()
    const topicsStore = useTopicsStore()
    
    // Load topic but disable all questions
    topicsStore.loadFromYaml(`
name: Test Topic
questions:
  - - "A: apple"
`)
    topicsStore.deselectAllSets()
    
    // Should handle empty set gracefully
    quizStore.startNewQuestion()
    expect(quizStore.currentQuestion).toBeNull()
  })

  it('should reset usage tracking when validateCurrentQuestion is called', () => {
    const quizStore = useQuizStore()
    const topicsStore = useTopicsStore()
    
    // Load topic and generate some questions to build usage history
    topicsStore.loadFromYaml(`
name: Test Topic
questions:
  - - "A: apple"
    - "B: banana"
`)
    
    // Generate some usage history
    for (let i = 0; i < 5; i++) {
      quizStore.startNewQuestion()
    }
    
    // Usage count should have data
    expect(quizStore.questionUsageCount.size).toBeGreaterThan(0)
    
    // Validate current question (simulates question set changes)
    quizStore.validateCurrentQuestion()
    
    // Usage tracking should be reset
    expect(quizStore.questionUsageCount.size).toBe(0)
  })

  it('should maintain fair distribution after question set changes', () => {
    const quizStore = useQuizStore()
    const topicsStore = useTopicsStore()
    
    // Load topic with multiple sets
    topicsStore.loadFromYaml(`
name: Test Topic
questions:
  - - "A: apple"
    - "B: banana"
  - - "X: xray"
    - "Y: yellow"
`)
    
    // Generate some questions with all sets active
    for (let i = 0; i < 10; i++) {
      quizStore.startNewQuestion()
    }
    
    // Now disable second set (simulates user toggling)
    topicsStore.toggleSet(1) // Disable second set
    quizStore.validateCurrentQuestion() // This should reset usage tracking
    
    // Generate more questions - should only see A and B now, with fresh distribution
    const questionsAfterToggle = new Set<string>()
    for (let i = 0; i < 10; i++) {
      quizStore.startNewQuestion()
      if (quizStore.currentQuestion) {
        questionsAfterToggle.add(quizStore.currentQuestion.question)
      }
    }
    
    // Should only contain questions from first set
    expect(questionsAfterToggle.has('A')).toBe(true)
    expect(questionsAfterToggle.has('B')).toBe(true)
    expect(questionsAfterToggle.has('X')).toBe(false)
    expect(questionsAfterToggle.has('Y')).toBe(false)
  })

  it('should track usage count correctly', () => {
    const quizStore = useQuizStore()
    const topicsStore = useTopicsStore()
    
    // Mock random to make test deterministic
    const originalRandom = Math.random
    let callCount = 0
    Math.random = () => {
      // Alternate between 0 and 0.999 to ensure we hit different questions
      return callCount++ % 2 === 0 ? 0.1 : 0.9
    }
    
    topicsStore.loadFromYaml(`
name: Test Topic
questions:
  - - "A: apple"
    - "B: banana"
`)
    
    // Generate first question
    quizStore.startNewQuestion()
    const firstQuestionKey = `${quizStore.currentQuestion?.question}:${quizStore.currentQuestion?.answer}`
    
    // Generate second question  
    quizStore.startNewQuestion()
    
    // First question should have count of 1, second should have count of 1
    expect(quizStore.questionUsageCount.get(firstQuestionKey)).toBe(1)
    
    // Restore original random
    Math.random = originalRandom
  })
})