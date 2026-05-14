'use client'

import { Provider } from 'react-redux'
import { persistor, store } from './index'
import { PersistGate } from 'redux-persist/integration/react'

export default function StoreProvider ({ children }) {
  return (
    <Provider store={store} >
        <PersistGate loading={null} persistor={persistor}>
          {children}
        </PersistGate>
    </Provider>
  )
}
