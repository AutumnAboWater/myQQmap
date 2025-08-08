import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { v4 as uuidv4 } from 'uuid'

export interface NoteItem {
  id: string
  title: string
  content: string
  tags: string[]
  createdAt: number
  updatedAt: number
}

export const useNotesStore = defineStore('notes', {
  state: () => ({
    notes: useStorage<NoteItem[]>('notebook.notes', []),
    selectedNoteId: useStorage<string | null>('notebook.selected', null),
    keyword: '' as string,
    activeTags: [] as string[],
  }),
  getters: {
    sortedNotes(state) {
      return [...state.notes].sort((a, b) => b.updatedAt - a.updatedAt)
    },
    filteredNotes(state): NoteItem[] {
      const keywordLower = state.keyword.trim().toLowerCase()
      const hasKeyword = keywordLower.length > 0
      const hasTags = state.activeTags.length > 0
      return this.sortedNotes.filter((note) => {
        const matchKeyword = !hasKeyword ||
          note.title.toLowerCase().includes(keywordLower) ||
          note.content.toLowerCase().includes(keywordLower)
        const matchTags = !hasTags || state.activeTags.every(t => note.tags.includes(t))
        return matchKeyword && matchTags
      })
    },
    allTags(state): string[] {
      const set = new Set<string>()
      state.notes.forEach(n => n.tags.forEach(t => set.add(t)))
      return Array.from(set).sort((a, b) => a.localeCompare(b))
    },
    selectedNote(state): NoteItem | null {
      return state.notes.find(n => n.id === state.selectedNoteId) ?? null
    },
  },
  actions: {
    createNote(partial?: Partial<Pick<NoteItem, 'title' | 'content' | 'tags'>>): NoteItem {
      const now = Date.now()
      const newNote: NoteItem = {
        id: uuidv4(),
        title: partial?.title ?? '未命名笔记',
        content: partial?.content ?? '',
        tags: partial?.tags ?? [],
        createdAt: now,
        updatedAt: now,
      }
      this.notes.push(newNote)
      this.selectedNoteId = newNote.id
      return newNote
    },
    updateNote(id: string, payload: Partial<Pick<NoteItem, 'title' | 'content' | 'tags'>>) {
      const note = this.notes.find(n => n.id === id)
      if (!note) return
      if (payload.title !== undefined) note.title = payload.title
      if (payload.content !== undefined) note.content = payload.content
      if (payload.tags !== undefined) note.tags = payload.tags
      note.updatedAt = Date.now()
    },
    deleteNote(id: string) {
      const index = this.notes.findIndex(n => n.id === id)
      if (index >= 0) {
        this.notes.splice(index, 1)
        if (this.selectedNoteId === id) {
          this.selectedNoteId = this.notes[0]?.id ?? null
        }
      }
    },
    selectNote(id: string | null) {
      this.selectedNoteId = id
    },
    setKeyword(keyword: string) {
      this.keyword = keyword
    },
    setActiveTags(tags: string[]) {
      this.activeTags = tags
    },
    addTagToSelected(tag: string) {
      const note = this.selectedNote
      if (!note) return
      if (!note.tags.includes(tag)) {
        note.tags.push(tag)
        note.updatedAt = Date.now()
      }
    },
    removeTagFromSelected(tag: string) {
      const note = this.selectedNote
      if (!note) return
      note.tags = note.tags.filter(t => t !== tag)
      note.updatedAt = Date.now()
    }
  },
})