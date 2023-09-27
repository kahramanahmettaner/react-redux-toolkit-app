import { createSlice } from "@reduxjs/toolkit";

const initialState = [
    { id: '1', title: 'Football', content: 'Footbal is a sport and very popular' },
    { id: '2', title: 'Movies', content: 'These movies are so good!' },
    { id: '3', title: 'IMDB', content: 'I like to check the ratings of the movies I watched on IMDB' },
    { id: '4', title: 'News are good?', content: 'What do you mean, if the news are good?' }
]

const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {}
})

export const getAllPosts = (state) => state.posts

export default postSlice.reducer