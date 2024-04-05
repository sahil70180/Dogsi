import { createApi , fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { userApi } from "./userApi";


// create a auth api that will contains all the endopints related to authentication
export const authApi = createApi({
    reducerPath : 'authApi',
    baseQuery : fetchBaseQuery({baseUrl : "/api/v1"}),
    endpoints : (buidler) => ({
        // Endpoint 1 : Register User
        register : buidler.mutation({
            query(body) {
                return {
                    url : "/register",
                    method : "POST",
                    body,
                }
            }
        }),
        // Endpoint 2 : Login
        login : buidler.mutation({
            query(body) {
                return {
                    url : "/login",
                    method : "POST",
                    body,
                };
            },
            async onQueryStarted(args, {dispatch, queryFulfilled}) {
                try {
                    await queryFulfilled;
                    await dispatch(userApi.endpoints.getMe.initiate(null));
                } catch (error) {
                    console.log(error);
                    
                }
            }
        }),
        // Endpoint 3 : Logout user 
        logout : buidler.query({
            query : () => "/logout",
        }),     
             
    })
})


export const { useLoginMutation, useRegisterMutation, useLazyLogoutQuery } = authApi;