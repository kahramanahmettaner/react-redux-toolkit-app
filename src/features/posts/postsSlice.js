import { createSlice, nanoid } from "@reduxjs/toolkit";
import { sub } from 'date-fns'

const initialState = [
    { id: '1', title: 'Football', content: 'Footbal is a sport and very popular', date: sub(new Date(), { minutes: 10 }).toISOString() },
    { id: '2', title: 'Movies', content: 'These movies are so good!', date: sub(new Date(), { minutes: 5 }).toISOString() },
    { id: '3', title: 'IMDB', content: 'I like to check the ratings of the movies I watched on IMDB', date: sub(new Date(), { minutes: 12 }).toISOString() },
    { id: '4', title: 'News are good?', content: 'What do you mean, if the news are good?', date: sub(new Date(), { minutes: 20 }).toISOString() }
]

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        postAdded: {
            reducer(state, action) { state.push(action.payload) }, // state.push normally would mutate the state. but it does only not hier inside the createSlice
            prepare(title, content, userId) { 
                return { payload: { id: nanoid(), title, content, date: new Date().toISOString(), userId } 
            } }
        }    
    }
})

// Selectors
export const getAllPosts = (state) => state.posts

// Actions
export const { postAdded } = postsSlice.actions // when we add postAdded function in reducers, than crateSlice automatically generates an action creater function with the same name.

// Reducer
export default postsSlice.reducer