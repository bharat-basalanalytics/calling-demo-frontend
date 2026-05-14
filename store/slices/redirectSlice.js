import { createSlice } from '@reduxjs/toolkit'

const redirectSlice = createSlice({
  name: 'redirect',
  initialState: {
    path: null
  },
  reducers: {
    setRedirect (state, action) {
      state.path = action.payload
    },
    resetRedirect (state) {
      state.path = null
    }
  }
})

export const { setRedirect, resetRedirect } = redirectSlice.actions
export { redirectSlice }
