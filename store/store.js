import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import persistStore from 'redux-persist/es/persistStore'
import storage from '@/store/storePersist'
import api from './api'
import { redirectSlice } from './slices/redirectSlice'
import { userSlice } from './slices/userSlice'
import { notesSlice } from './slices/notesSlice'

const persistConfig = {
  key: 'callingdemo',
  storage,
  blacklist: ['loading', 'api']
}

const reducers = combineReducers({
  [redirectSlice.name]: redirectSlice.reducer,
  [userSlice.name]: userSlice.reducer,
  [notesSlice.name]: notesSlice.reducer,
  [api.reducerPath]: api.reducer
})

const persistedReducer = persistReducer(persistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: { warnAfter: 128 },
      serializableCheck: false
    }).concat(api.middleware)
})

export const persistor = persistStore(store)
