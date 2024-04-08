import React, {  useEffect, useState } from 'react'
import Adminlayout from '../layout/Adminlayout'
import { PRODUCT_CATEGORIES } from '../../constants/Constants';
import toast from "react-hot-toast"
import { useGetProductDetailsQuery, useUpdateProductMutation } from '../../redux/api/productApi';
import {useNavigate, useParams} from "react-router-dom"
import MetaData from '../layout/MetaData';

const UpdateProduct = () => {

    const params = useParams();

    const [product, setProduct] = useState({
        name : "",
        description : "",
        price : "",
        category : "",
        stock : "",
        seller : "",
    })    
    const {name , description, price, category, stock, seller} = product;

    const navigate = useNavigate()

    const {data} = useGetProductDetailsQuery(params?.id);
    const [updateProduct, {error, isLoading, isSuccess}] = useUpdateProductMutation();

    useEffect(() => {
        if(data?.product){
            setProduct({
                name : data?.product?.name,
                description : data?.product?.description,
                price : data?.product?.price,
                category : data?.product?.category,
                stock : data?.product?.stock,
                seller : data?.product?.seller,
            })
        }
        if(isSuccess){
          toast.success("Product Updated")
          navigate("/admin/products");
        }
        if(error){
            toast.error(error?.data?.message)
        }
    },[error, isSuccess, navigate, setProduct, data?.product])

    const handeleOnchange = (e) => {
        setProduct({...product ,[e.target.name] : e.target.value});
    }

    const submithandler = async (e) => {
        e.preventDefault();
        await updateProduct({id : params?.id, body : product});
    }
   return (
    <Adminlayout>
        <MetaData title={"Update Product"}/>        
    <div className="row wrapper">
    <div className="col-10 col-lg-10 mt-5 mt-lg-0">
      <form className="shadow rounded bg-body" onSubmit={submithandler}>
        <h2 className="mb-4">Update Product</h2>
        <div className="mb-3">
          <label for="name_field" className="form-label"> Name </label>
          <input
            type="text"
            id="name_field"
            className="form-control"
            name="name"
            value={name}
            onChange={handeleOnchange}
            />
        </div>

        <div className="mb-3">
          <label for="description_field" className="form-label">
            Description
          </label>
          <textarea
            className="form-control"
            id="description_field"
            rows="8"
            name="description"
            value={description}
            onChange={handeleOnchange}
            ></textarea>
        </div>

        <div className="row">
          <div className="mb-3 col">
            <label for="price_field" className="form-label"> Price </label>
            <input
              type="text"
              id="price_field"
              className="form-control"
              name="price"
              value={price}
              onChange={handeleOnchange}
              />
          </div>

          <div className="mb-3 col">
            <label for="stock_field" className="form-label"> Stock </label>
            <input
              type="number"
              id="stock_field"
              className="form-control"
              name="stock"
              value={stock}
              onChange={handeleOnchange}
              />
          </div>
        </div>
        <div className="row">
          <div className="mb-3 col">
            <label for="category_field" className="form-label" > Category </label>
            <select className="form-select" id="category_field" name="category" value={category} onChange={handeleOnchange}>
              {PRODUCT_CATEGORIES?.map((category) => (
                <option value={category} key={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="mb-3 col">
            <label for="seller_field" className="form-label"> Seller Name </label>
            <input
              type="text"
              id="seller_field"
              className="form-control"
              name="seller"
              value={seller}
              onChange={handeleOnchange}
              />
          </div>
        </div>
        <button type="submit" className="btn w-100 py-2" disabled={isLoading}>
        {isLoading ? "Updating..." : "UPDATE"}
        </button>
      </form>
    </div>
  </div>
              </Adminlayout>
  )
}

export default UpdateProduct