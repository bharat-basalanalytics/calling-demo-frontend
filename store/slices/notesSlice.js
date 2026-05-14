import { createSlice } from '@reduxjs/toolkit'

const notesSlice = createSlice({
  name: 'notes',
  initialState: {
    mentions: []
  },
  reducers: {
    setNotesMentions (state, action) {
      state.mentions = action.payload
    }
  }
})

export const { setNotesMentions } = notesSlice.actions
export { notesSlice }
