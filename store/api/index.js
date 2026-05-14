import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import CONSTANTS from '@/constants'

const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: CONSTANTS.API,
    prepareHeaders: (headers) => {
      headers.set('Accept', 'application/json')
      headers.set('Cache-Control', 'no-cache')
      return headers
    }
  }),
  tagTypes: [],
  endpoints: () => ({})
})

export default api
