import React, { useEffect } from "react";
import MetaData from "./layout/MetaData";
import { useGetProductsQuery } from "../redux/api/productApi";
import ProductItem from "./product/ProductItem";
import Loader from "./layout/Loader";
import toast from "react-hot-toast";
import CustomPagination from "./layout/CustomPagination";
import { useSearchParams } from "react-router-dom";
import Filters from "./layout/Filters";
import Banner from "../assets/images/FirstBanner.jpg";

const Home = () => {
  let [searchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;
  const keyword = searchParams.get("keyword") || "";
  const category = searchParams.get("category");
  const min = searchParams.get("min");
  const max = searchParams.get("max");

  const params = {
    page,
    keyword,
  };

  min != null && (params.min = min);
  max != null && (params.max = max);
  category != null && (params.category = category);

  const { data, isLoading, error, isError } = useGetProductsQuery(params);

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message);
    }
  }, [isError, error?.data?.message]);

  const columnSize = keyword ? 4 : 3;

  if (isLoading) return <Loader />;

  return (
    <>
      <MetaData title={"Buy Best Product Online"} />
    <div className="banner">
      <img src={Banner} alt="global-banner" className="home-banner" />      
    </div>
      <div className="container">
        <div className="row">
          {keyword && (
            <div className="col-6 col-md-3 mt-5">
              <Filters />
            </div>
          )}
          <div className={keyword ? "col-6 col-md-9" : "col-6 col-md-12"}>
            <section id="products" className="mt-5">
              <div className="row">
                {data?.products?.map((product) => (
                  <ProductItem product={product} columnSize={columnSize} key={product?._id}/>
                ))}
              </div>
            </section>
            <CustomPagination
              responsePerPage={data?.responsePerPage}
              filteredProductsCount={data?.filteredProductsCount}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
