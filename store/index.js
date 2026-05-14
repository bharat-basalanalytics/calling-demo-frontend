export { store, persistor } from './store'

export { setUser } from './slices/userSlice'
export { setRedirect, resetRedirect } from './slices/redirectSlice'
export { setNotesMentions } from './slices/notesSlice'

export {
  useListCallLogsMutation,
  useGetAssistantsQuery,
  useGetPhoneNumbersQuery,
  useTriggerCallMutation
} from './api/communications'
