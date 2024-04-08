import React, { useEffect, useState } from 'react'
import Adminlayout from '../layout/Adminlayout'
import { PRODUCT_CATEGORIES } from '../../constants/Constants';
import toast from "react-hot-toast"
import { useCreateProductMutation } from '../../redux/api/productApi';
import {useNavigate} from "react-router-dom"
import MetaData from '../layout/MetaData';
const NewProduct = () => {

    const [product, setProduct] = useState({
        name : "",
        description : "",
        price : "",
        category : "",
        stock : "",
        seller : "",
    })

    const navigate = useNavigate()

    const {name , description, price, category, stock, seller} = product;

    const [createProduct, {error, isLoading, isSuccess}] = useCreateProductMutation();

    useEffect(() => {
        if(error){
            toast.error(error?.data?.message)
        }
        if(isSuccess){
            toast.success("Product Created Successfully")
            navigate("/admin/products");
        }
    },[error, isSuccess, navigate])

    const handeleOnchange = (e) => {
        setProduct({...product ,[e.target.name] : e.target.value});
    }

    const submithandler = async (e) => {
        e.preventDefault();
        console.log(product);

        await createProduct(product);
    }
   return (
    <Adminlayout>
        <MetaData title={"Create New Product"}/>        
    <div className="row wrapper">
    <div className="col-10 col-lg-10 mt-lg-0">
      <form className="shadow rounded bg-body" onSubmit={submithandler}>
        <h2 className="mb-4">New Product</h2>
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
        {isLoading ? "Creating..." : "CREATE"}
        </button>
      </form>
    </div>
  </div>
</Adminlayout>
  )
}

export default NewProduct