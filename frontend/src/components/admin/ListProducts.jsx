import React, { useEffect } from "react";
import Loader from "../layout/Loader";
import toast from "react-hot-toast";
import MetaData from "../layout/MetaData";
import { MDBDataTable } from "mdbreact";
import { Link } from "react-router-dom";
import Adminlayout from "../layout/Adminlayout";
import {useDeleteProductMutation, useGetAdminProdcutsQuery} from "../../redux/api/productApi"

const ListProducts = () => {
  const { data, error, isLoading } = useGetAdminProdcutsQuery()

  const [deleteProduct, {isLoading : isDeleteLoading, error : isDeleteError, isSuccess}] = useDeleteProductMutation();

  const deletproductHandler = async (id) => {
    await deleteProduct(id);
  }

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
    if(isDeleteError){
      toast.error(error?.data?.message)
    }
    if(isSuccess){
      toast.success("Prodcut Deleted")
    }
  }, [error, isSuccess, isDeleteError]);

  const setProducts = () => {
    const products = {
      columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Name",
          field: "name",
          sort: "asc",
        },
        {
          label: "Stock",
          field: "stock",
          sort: "asc",
        },
        {
          label: "Actions",
          field: "actions",
          sort: "asc",
        },
      ],
      rows: [],
    };

    data?.products?.forEach((product) => {
      products.rows.push({
        id: product?._id,
        name: `${product?.name.substring(0,22)}...`,
        stock: product?.stock,
        actions: (
          <>
            <Link
              to={`/admin/products/${product?._id}`}
              className="btn btn-outline-primary ms-2"
            >
              <i className="fa fa-pencil"></i>
            </Link>
            <button 
              className="btn btn-outline-danger ms-2"
              onClick={() => deletproductHandler(product?._id)}
              disabled={isDeleteLoading}
            >
              <i className="fa fa-trash"></i>
            </button>
          </>
        ),
      });
    });
    return products;
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Adminlayout>
      <MetaData title={"All products"} />
      {data?.products?.length > 0 ? (
        <>
          <h1 className="my-5">Total Products : {data?.products?.length}</h1>
          <MDBDataTable
            data={setProducts()}
            className="px-3"
            bordered
            striped
            hover
          />
        </>
      ) : (
        <h1 className="m-5">No products in the Database</h1>
      )}
    </Adminlayout>
  );
};

export default ListProducts;