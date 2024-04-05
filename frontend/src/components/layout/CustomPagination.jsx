import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Pagination from "react-js-pagination";

const CustomPagination = ({ responsePerPage, filteredProductsCount }) => {
  const [currentpage, setCurrentpage] = useState("");
  let [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const page = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    setCurrentpage(page);
  }, [page]);

  const setCurrentpageNo = (pageNumber) => {
    setCurrentpage(pageNumber);

    if (searchParams.has("page")) {
      searchParams.set("page", pageNumber);
    } else {
      searchParams.append("page", pageNumber);
    }

    const path = window.location.pathname + "?" + searchParams.toString();
    navigate(path);
  };

  return (
    <div className="d-flex justify-content-center mt-3 mb-3">
      {filteredProductsCount > responsePerPage && (
        <Pagination
          activePage={currentpage}
          itemsCountPerPage={responsePerPage}
          totalItemsCount={filteredProductsCount}
          onChange={setCurrentpageNo}
          nextPageText={"Next"}
          prevPageText={"Prev"}
          firstPageText={"First"}
          lastPageText={"Last"}
          itemClass="page-item"
          linkClass="page-link"
        />
      )}
    </div>
  );
};

export default CustomPagination;
