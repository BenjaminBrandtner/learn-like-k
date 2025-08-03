import { ref } from 'vue'
import { defineStore } from 'pinia'
import yaml from 'js-yaml'

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

  // Load persisted state on initialization
  function loadPersistedState() {
    try {
      const savedTopic = localStorage.getItem('learn-like-k-topic')
      const savedYaml = localStorage.getItem('learn-like-k-yaml')
      const savedSets = localStorage.getItem('learn-like-k-enabled-sets')
      
      if (savedTopic && savedYaml) {
        currentTopic.value = JSON.parse(savedTopic)
        yamlText.value = savedYaml
        
        if (savedSets) {
          enabledSets.value = JSON.parse(savedSets)
        } else {
          enabledSets.value = new Array(currentTopic.value?.questions.length || 0).fill(true)
        }
      }
    } catch (error) {
      console.error('Failed to load persisted state:', error)
    }
  }

  function saveState() {
    try {
      if (currentTopic.value) {
        localStorage.setItem('learn-like-k-topic', JSON.stringify(currentTopic.value))
        localStorage.setItem('learn-like-k-yaml', yamlText.value)
        localStorage.setItem('learn-like-k-enabled-sets', JSON.stringify(enabledSets.value))
      }
    } catch (error) {
      console.error('Failed to save state:', error)
    }
  }

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
      
      saveState()
    } catch (error) {
      loadError.value = error instanceof Error ? error.message : 'Failed to parse YAML'
      console.error('YAML parsing error:', error)
    }
  }

  function toggleSet(index: number) {
    if (index >= 0 && index < enabledSets.value.length) {
      enabledSets.value[index] = !enabledSets.value[index]
      saveState()
    }
  }

  function selectAllSets() {
    enabledSets.value = enabledSets.value.map(() => true)
    saveState()
  }

  function deselectAllSets() {
    enabledSets.value = enabledSets.value.map(() => false)
    saveState()
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

  function getActiveQuestions() {
    if (!currentTopic.value) return []
    
    const activeQuestions: string[] = []
    currentTopic.value.questions.forEach((set, index) => {
      if (enabledSets.value[index]) {
        activeQuestions.push(...set)
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
    
    // Clear localStorage
    localStorage.removeItem('learn-like-k-topic')
    localStorage.removeItem('learn-like-k-yaml')
    localStorage.removeItem('learn-like-k-enabled-sets')
  }

  // Initialize persisted state when store is created
  loadPersistedState()

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
})
