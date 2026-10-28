import { createSlice } from '@reduxjs/toolkit'

const requestsSlice = createSlice({
  name: 'request',
  initialState: null,
  reducers: {
    addRequest: (state, action) => action.payload,
    removeRequest: (state, action) => {
      if (!state?.data) return state

      return {
        ...state,
        data: state.data.filter((request) => request._id !== action.payload),
      }
    },
  },
})

export const { addRequest, removeRequest } = requestsSlice.actions

export default requestsSlice.reducer
