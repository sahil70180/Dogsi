import React from 'react'
import SidebarMenu from './SidebarMenu'

const Adminlayout = ({children}) => {

    const menuItems = [
        {
          name: "Dashboard",
          url: "/admin/dashboard",
          icon: "fas fa-tachometer-alt",
        },
        {
          name: "New Product",
          url: "/admin/product/new",
          icon: "fas fa-plus",
        },
        {
          name: "Products",
          url: "/admin/products",
          icon: "fab fa-product-hunt",
        }
      ];
  return (
    <div>
      <div className=' p-3'>
        <h2 className='text-center fw-bolder'>Admin Dashboard</h2>       
      </div>
      <div className="container">
        <div className='row justify-content-around'>
            <div className='col-12 col-lg-3'>
                <SidebarMenu menuItems={menuItems}/>
            </div>
            <div className='col-12 col-lg-8 user-dashboard'>{children}</div>
        </div>
      </div>
    </div>
  )
}

export default Adminlayout
