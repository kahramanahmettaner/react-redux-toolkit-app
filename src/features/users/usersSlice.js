import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = [
    { id: '0', name: 'Dude Lebowksi' },
    { id: '1', name: 'Neil Young' },
    { id: '2', name: 'Dave Gray' }
]

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {}
})

// Selectors
export const getAllUsers = (state) => state.users

// Reducer
export default usersSlice.reducer