import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AdminAddCategory from './pages/admin-add-category';
import Login from './pages/admin-login';
import AdminDashBoard from './pages/admin-deshboard';
import AdminCategory from './pages/admin-categores';
import AdminProduct from './pages/admin-product';
import AdminSubCategory from './pages/admin-subCategory';
import AdminUser from './pages/admin-user';
import AdminEditCategory from './pages/admin-edit-category';
import "bootstrap/dist/css/bootstrap.min.css";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<Login/>}/>
    <Route path="/dashboard" element={<AdminDashBoard/>} />
   <Route path='/category/adminAddCategory' element={<AdminAddCategory/>} />
   <Route path="/adminCategory" element={<AdminCategory/>} />
   <Route path="/adminProduct" element={<AdminProduct/>} />
   <Route path="/adminSubCategory" element={<AdminSubCategory/>} />
   <Route path="/adminUser" element={<AdminUser/>} />
   <Route path="/category/adminEditCategory/:id" element={<AdminEditCategory/>} />
   
  </Routes>
    </BrowserRouter>
);
 
reportWebVitals();
