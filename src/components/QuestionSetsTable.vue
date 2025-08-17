<script setup lang="ts">
import { useTopicsStore } from '../stores/topics.ts'

const topicsStore = useTopicsStore()
</script>

<template>
  <div v-if="topicsStore.currentTopic" class="p-4 rounded border border-gray-200">
    <div class="flex justify-between items-center mb-2.5">
      <h3 class="m-0 text-slate-800 font-bold">Questions</h3>
      <div class="flex gap-2">
        <button @click="topicsStore.selectAllSets" class="px-3 py-1.5 border-none rounded cursor-pointer text-sm bg-green-500 text-white hover:bg-green-600">Select All</button>
        <button @click="topicsStore.deselectAllSets" class="px-3 py-1.5 border-none rounded cursor-pointer text-sm bg-gray-500 text-white hover:bg-gray-600">Deselect All</button>
      </div>
    </div>
    <table class="w-full border-collapse mt-2.5 bg-white rounded overflow-hidden">
      <thead>
        <tr>
          <th class="w-20 bg-gray-200 px-3 py-3 text-left font-bold text-slate-800 border-b-2 border-gray-300">Enable</th>
          <th class="w-30 bg-gray-200 px-3 py-3 text-left font-bold text-slate-800 border-b-2 border-gray-300">Set</th>
          <th class="w-auto bg-gray-200 px-3 py-3 text-left font-bold text-slate-800 border-b-2 border-gray-300">Questions → Answers</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="(set, index) in topicsStore.getParsedQuestionSets()" 
          :key="index"
          :class="{ 'opacity-60': !topicsStore.enabledSets[index] }"
          class="cursor-pointer transition-colors duration-200 hover:bg-slate-50"
          @click="topicsStore.toggleSet(index)"
        >
          <td class="px-3 py-3 border-b border-gray-300 align-top text-center">
            <input 
              type="checkbox" 
              :checked="topicsStore.enabledSets[index]"
              @change="topicsStore.toggleSet(index)"
              @click.stop
              class="scale-125"
            />
          </td>
          <td class="px-3 py-3 border-b border-gray-300 align-top font-bold">
            <strong>Set {{ index + 1 }}</strong>
            <div class="text-sm text-gray-600 font-normal mt-1">{{ set.length }} questions</div>
          </td>
          <td class="px-3 py-3 border-b border-gray-300 align-top">
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="(qa, qaIndex) in set" 
                :key="qaIndex" 
                class="bg-slate-50 px-2 py-1 rounded text-sm border border-gray-200"
                :class="{ '!bg-gray-100 !text-gray-500': !topicsStore.enabledSets[index] }"
              >
                <strong>{{ qa.question }}</strong> → {{ qa.answer }}
              </span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>