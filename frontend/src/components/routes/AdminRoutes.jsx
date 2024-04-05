import React from 'react'
import { Route } from 'react-router-dom'
import ProtectedRoute from '../auth/ProtectedRoute'
import AdminDashboard from '../admin/AdminDashboard'
const AdminRoutes = () => {
  return (
    <>
    <Route exact path="/admin/dashboard" element={
        <ProtectedRoute admin={true}>
          <AdminDashboard/>          
        </ProtectedRoute>
    }/>
    </>
  )
}

export default AdminRoutes
