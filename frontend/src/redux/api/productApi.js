import { createApi , fetchBaseQuery } from "@reduxjs/toolkit/query/react"


// create a product api that will all the endopints related to product
export const productApi = createApi({
    reducerPath : 'productApi',
    baseQuery : fetchBaseQuery({baseUrl : "/api/v1"}),
    tagTypes :  ["Product", "AdminProducts"],
    endpoints : (buidler) => ({

        // Endpoint 1 : Get All products
        getProducts : buidler.query({
            query : (params) => ({
                url : "/products",
                params : {
                    page : params?.page,
                    keyword : params?.keyword,
                    category : params?.category,
                    "price[gte]" : params?.min,
                    "price[lte]" : params?.max,
                    "ratings[gte]" : params?.ratings,
                },
            })
        }),
        // Endpoint 2 : Get Particular Product Details
        getProductDetails : buidler.query({
            query : ( id ) => `/products/${id}`,
            providesTags : ["Product"]
        }),
        submitReview : buidler.mutation({
            query(body) {
                return {
                    url : "/reviews",
                    method : "PUT",
                    body,
                };
            },
            invalidatesTags : ["Product"]
        }),
        canUserReview : buidler.query({
            query : (productId) => `/can_review/?productId=${productId}`,
        }),
        getAdminProdcuts : buidler.query({
            query : () => `/admin/products`,
            providesTags : ["AdminProducts"]
        }),
        createProduct : buidler.mutation({
            query(body){
                return {
                    url : "/admin/product/new",
                    method : "POST",
                    body,
                }
            },
            invalidatesTags : ["AdminProducts"]
        }),
        updateProduct : buidler.mutation({
            query({id , body}){
                return {
                    url : `/admin/products/${id}`,
                    method : "PUT",
                    body,
                }
            },
            invalidatesTags : ["AdminProducts", "Product"]
        }),
        deleteProduct : buidler.mutation({
            query(id){
                return {
                    url : `/admin/products/${id}`,
                    method : "DELETE"
                }
            },
            invalidatesTags : ["AdminProducts", "Product"]
        })
    })
})

// getProducts is a endpoint name, and now we have to export it like a hook (RTK documentation)
// the reason for exporting hook is that we can use isLoading, iserro and all these varaibles directly 

export const  { useGetProductsQuery, useGetProductDetailsQuery, useSubmitReviewMutation, useCanUserReviewQuery, useGetAdminProdcutsQuery, useCreateProductMutation, useUpdateProductMutation, useDeleteProductMutation} = productApi