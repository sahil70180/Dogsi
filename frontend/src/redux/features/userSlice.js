// slice is a collection of reducer logic and actions for single feature for our app
import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    user : null,
    isAuthenticated : false,
    loading : true,
}
// creating user Slice
export const userSlice = createSlice({
    initialState,
    name : "userSlice",
    reducers : {
        setUser(state, action){
            state.user  = action.payload;
        },
        setIsAuthenticated(state, action){
            state.isAuthenticated = action.payload;
        },
        setloading(state, action){
            state.loading = action.payload;
        },
    }
})

export default userSlice.reducer;
export const  {setIsAuthenticated, setUser, setloading} = userSlice.actions