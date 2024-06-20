import { createApi , fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const orderApi = createApi({
    reducerPath : "orderApi",
    tagTypes : ["Order"],
    baseQuery : fetchBaseQuery({baseUrl : "/api/v1"}),
    endpoints : (builder) => ({
        createNewOrder : builder.mutation({
            query(body) {
                return {
                    url : "/orders/new",
                    method : "POST",
                    body,
                };
            },
            invalidatesTags : ["Order"]
        }),
        myOders : builder.query({
            query :() => `/me/orders`,
            providesTags : ["Order"]
        }),
        orderDetails : builder.query({
            query :(id) => `/orders/${id}`
        }),
        stripeCheckoutSession : builder.mutation({
            query(body)  {
                return {
                    url : "/payment/checkout_session",
                    method : "POST",
                    body,
                };
            },
        }),
        getSalesData : builder.query({
            query : ({startDate, endDate}) => `/admin/get_sales?startDate=${startDate}&endDate=${endDate}`
        })
    }),
});

export const { useCreateNewOrderMutation, useStripeCheckoutSessionMutation, useMyOdersQuery, useOrderDetailsQuery, useLazyGetSalesDataQuery } = orderApi;