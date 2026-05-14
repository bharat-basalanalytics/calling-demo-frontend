import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState: {
    _id: null,
    name: '',
    email: '',
    picture: '/icons/user.png',
    permissions: []
  },
  reducers: {
    setUser (state, action) {
      return ({ ...state, ...action.payload })
    }
  }
})

export const { setUser } = userSlice.actions
export { userSlice }
