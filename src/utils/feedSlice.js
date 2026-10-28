import { createSlice } from '@reduxjs/toolkit'

const feedSlice = createSlice({
  name: 'feed',
  initialState: null,
  reducers: {
    addFeed: (state, action) => action.payload,
    removeUserFromFeed: (state, action) => {
      if (!state?.data) return state

      return {
        ...state,
        data: state.data.filter((request) => request._id !== action.payload),
      }
    },
  },
})

export const { addFeed, removeUserFromFeed } = feedSlice.actions

export default feedSlice.reducer
