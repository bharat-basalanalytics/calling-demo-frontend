import api from '../index'

const communicationsApi = api.injectEndpoints({
  endpoints: (build) => ({
    listCallLogs: build.mutation({
      query: (params) => ({
        url: '/communications/vapi/calls',
        method: 'GET',
        params
      })
    }),
    getAssistants: build.query({
      query: () => ({
        url: '/communications/vapi/assistants',
        method: 'GET'
      })
    }),
    getPhoneNumbers: build.query({
      query: () => ({
        url: '/communications/vapi/phone-numbers',
        method: 'GET'
      })
    }),
    triggerCall: build.mutation({
      query: (body) => ({
        url: '/communications/vapi/call/trigger',
        method: 'POST',
        body
      })
    })
  })
})

export const {
  useListCallLogsMutation,
  useGetAssistantsQuery,
  useGetPhoneNumbersQuery,
  useTriggerCallMutation
} = communicationsApi
