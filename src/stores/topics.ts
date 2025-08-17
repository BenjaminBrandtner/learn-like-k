import { ref } from 'vue'
import { defineStore } from 'pinia'
import yaml from 'js-yaml'

export interface Question {
  question: string
  answer: string
}

export interface Topic {
  name: string
  description?: string
  mode: string
  questions: string[][]
}

export const useTopicsStore = defineStore('topics', () => {
  const currentTopic = ref<Topic | null>(null)
  const yamlText = ref('')
  const loadError = ref('')
  const enabledSets = ref<boolean[]>([])

  function loadFromYaml(yamlContent: string) {
    try {
      loadError.value = ''
      const parsed = yaml.load(yamlContent) as Topic
      
      if (!parsed.name || !parsed.questions) {
        throw new Error('Invalid YAML format: missing name or questions')
      }
      
      currentTopic.value = parsed
      yamlText.value = yamlContent
      
      // Initialize all sets as enabled by default
      enabledSets.value = new Array(parsed.questions.length).fill(true)
    } catch (error) {
      loadError.value = error instanceof Error ? error.message : 'Failed to parse YAML'
      console.error('YAML parsing error:', error)
    }
  }

  function toggleSet(index: number) {
    if (index >= 0 && index < enabledSets.value.length) {
      enabledSets.value[index] = !enabledSets.value[index]
    }
  }

  function selectAllSets() {
    enabledSets.value = enabledSets.value.map(() => true)
  }

  function deselectAllSets() {
    enabledSets.value = enabledSets.value.map(() => false)
  }

  function parseQuestionAnswer(questionString: string) {
    const colonIndex = questionString.indexOf(':')
    if (colonIndex === -1) {
      return { question: questionString.trim(), answer: '' }
    }
    return {
      question: questionString.substring(0, colonIndex).trim(),
      answer: questionString.substring(colonIndex + 1).trim()
    }
  }

  function getActiveQuestions(): Question[] {
    if (!currentTopic.value) return []
    
    const activeQuestions: Question[] = []
    currentTopic.value.questions.forEach((set, index) => {
      if (enabledSets.value[index]) {
        const parsedSet = set.map(questionString => parseQuestionAnswer(questionString))
        activeQuestions.push(...parsedSet)
      }
    })
    return activeQuestions
  }

  function getParsedQuestionSets() {
    if (!currentTopic.value) return []
    
    return currentTopic.value.questions.map(set => 
      set.map(questionString => parseQuestionAnswer(questionString))
    )
  }

  function clearTopic() {
    currentTopic.value = null
    yamlText.value = ''
    loadError.value = ''
    enabledSets.value = []
  }

  return { 
    currentTopic, 
    yamlText, 
    loadError,
    enabledSets,
    loadFromYaml, 
    toggleSet,
    selectAllSets,
    deselectAllSets,
    getActiveQuestions,
    getParsedQuestionSets,
    clearTopic 
  }
}, {
  persist: {
    key: 'learn-like-k-topics',
    pick: ['currentTopic', 'yamlText', 'enabledSets']
  }
})
