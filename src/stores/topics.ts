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

  function loadFromYaml(yamlContent: string) {
    try {
      loadError.value = ''
      const parsed = yaml.load(yamlContent) as Topic
      
      if (!parsed.name || !parsed.questions) {
        throw new Error('Invalid YAML format: missing name or questions')
      }
      
      currentTopic.value = parsed
      yamlText.value = yamlContent
    } catch (error) {
      loadError.value = error instanceof Error ? error.message : 'Failed to parse YAML'
      console.error('YAML parsing error:', error)
    }
  }

  function clearTopic() {
    currentTopic.value = null
    yamlText.value = ''
    loadError.value = ''
  }

  return { 
    currentTopic, 
    yamlText, 
    loadError, 
    loadFromYaml, 
    clearTopic 
  }
})
