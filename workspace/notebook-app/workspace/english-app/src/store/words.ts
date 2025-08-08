import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { v4 as uuidv4 } from 'uuid'

export interface WordItem {
  id: string
  term: string
  definition: string
  example?: string
  tags: string[]
  easinessFactor: number
  intervalDays: number
  repetitions: number
  nextReviewAt: number
  createdAt: number
  updatedAt: number
}

export const useWordsStore = defineStore('words', {
  state: () => ({
    words: useStorage<WordItem[]>('english.words', []),
    keyword: '' as string,
    activeTags: [] as string[],
  }),
  getters: {
    allTags(state): string[] {
      const s = new Set<string>()
      state.words.forEach(w => w.tags.forEach(t => s.add(t)))
      return Array.from(s).sort((a, b) => a.localeCompare(b))
    },
    filtered(state): WordItem[] {
      const q = state.keyword.trim().toLowerCase()
      const hasQ = q.length > 0
      const hasTags = state.activeTags.length > 0
      return state.words.filter(w => {
        const matchQ = !hasQ || w.term.toLowerCase().includes(q) || w.definition.toLowerCase().includes(q)
        const matchTags = !hasTags || state.activeTags.every(t => w.tags.includes(t))
        return matchQ && matchTags
      }).sort((a, b) => b.updatedAt - a.updatedAt)
    },
    dueWords(state): WordItem[] {
      const now = Date.now()
      return state.words.filter(w => w.nextReviewAt <= now).sort((a, b) => a.nextReviewAt - b.nextReviewAt)
    },
  },
  actions: {
    addWord(payload: { term: string; definition: string; example?: string; tags?: string[] }) {
      const now = Date.now()
      const word: WordItem = {
        id: uuidv4(),
        term: payload.term,
        definition: payload.definition,
        example: payload.example,
        tags: payload.tags ?? [],
        easinessFactor: 2.5,
        intervalDays: 0,
        repetitions: 0,
        nextReviewAt: now,
        createdAt: now,
        updatedAt: now,
      }
      this.words.push(word)
    },
    updateWord(id: string, patch: Partial<Pick<WordItem, 'term' | 'definition' | 'example' | 'tags'>>) {
      const w = this.words.find(x => x.id === id)
      if (!w) return
      if (patch.term !== undefined) w.term = patch.term
      if (patch.definition !== undefined) w.definition = patch.definition
      if (patch.example !== undefined) w.example = patch.example
      if (patch.tags !== undefined) w.tags = patch.tags
      w.updatedAt = Date.now()
    },
    deleteWord(id: string) {
      const idx = this.words.findIndex(x => x.id === id)
      if (idx >= 0) this.words.splice(idx, 1)
    },
    review(id: string, quality: 0 | 1 | 2 | 3 | 4 | 5) {
      // SuperMemo SM-2 simplified
      const w = this.words.find(x => x.id === id)
      if (!w) return
      if (quality < 3) {
        w.repetitions = 0
        w.intervalDays = 1
      } else {
        const ef = Math.max(1.3, w.easinessFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)))
        w.easinessFactor = ef
        if (w.repetitions === 0) {
          w.intervalDays = 1
        } else if (w.repetitions === 1) {
          w.intervalDays = 6
        } else {
          w.intervalDays = Math.round(w.intervalDays * w.easinessFactor)
        }
        w.repetitions += 1
      }
      const ms = w.intervalDays * 24 * 60 * 60 * 1000
      w.nextReviewAt = Date.now() + ms
      w.updatedAt = Date.now()
    },
    setKeyword(q: string) { this.keyword = q },
    setActiveTags(tags: string[]) { this.activeTags = tags },
  }
})