import MyFooter from "../all/admin-footer";
import Sidebar from "../all/admin-sidebar";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import api from "../all/api";
import { ToastContainer } from "react-toastify";
import { showError, showMessage } from "../all/message";

export default function AdminProduct() {

  const [products, setProducts] = useState([]);
   
// GET ALL PRODUCT 
  useEffect(() => {
      axios.get(api + "/product/getData")
      .then((response) => {
        if (!response.data.success) {
          showError(response.data.message || "Failed to load products");
          return;
        }

        setProducts(response.data.data);  
        showMessage("Products fetched successfully");
      })
       .catch((err) => {
        showError(err.response?.data?.message || "Unable to fetch categories");
      });
  }, []);

  // DELETE PRODUCT
  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    axios.delete(api + "/product/deleteProduct/" + id)
    .then((response) => {
        if (!response.data.success) {
          showError(response.data.message);
          return;
        }
        setProducts(products.filter((item) => item.id !== id));
        showMessage("Product deleted successfully");
      })
       .catch((err) => {
        showError(err.response?.data?.message || "Unable to fetch product");
      });
  };

  const updateProduct = (id, isActive) => {
    const payload = { isActive: !isActive };

    axios
      .put(api + "/product/updateProduct/" + id, payload)
      .then((res) => {
        if (!res.data.success) {
          showError(res.data.message || "Update failed");
          return;
        }

        const updatedData = products.map((item) =>
          item.id === id ? { ...item, isActive: !isActive } : item
        );

        setProducts(updatedData);
        showMessage("Status Updated");
      })
      .catch((err) => {
        showError(err.response?.data?.message || "Unable to update Product");
      });
  };


  const getBaseImageAddress = () => api + "/uploads/";

  return (
    <div id="wrapper">

      <Sidebar />

      <div id="content-wrapper" className="d-flex flex-column">
        <ToastContainer />

        <div id="content">

          <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
            <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
              <i className="fa fa-bars" />
            </button>
          </nav>

          <div className="container-fluid">
            <div className="row">
              <div className="col-12">

                <div className="card shadow">
                  <div className="card-header bg-primary d-flex justify-content-between">
                    <h3 className="text-light">Product Management</h3>
                    <Link to="/product/adminAddProduct" className="btn btn-light">Add Product</Link>
                  </div>

                  <div className="card-body">
                    <table className="table table-bordered table-striped">
                      <thead>
                        <tr>
                          <th width="5%">Sr No</th>
                          <th width="40%">Name & Category</th>
                          <th width="15%">Photo</th>
                          <th width="10%">Price</th>
                          <th width="5%">Active</th>
                        </tr>
                      </thead>

                      <tbody>
                        {products.length === 0 ? (
                          <tr><td colSpan="7" className="text-center">No Products Found</td></tr>
                        ) : (
                          products.map((item, index) => (
                            <tr key={item.id}>
                              <td>{index + 1}</td>

                              <td>
                                <b>{item.name}</b>
                                <br />
                                <small>Cat: {item.categoryId?.name} </small>
                                <br />
                                <small>Sub: {item.subCategoryId?.name}</small>
                              </td>

                              <td>
                                <img
                                  src={getBaseImageAddress() + item.image}
                                  alt="product"
                                  className="img-fluid"
                                  style={{ maxHeight: "70px" }}
                                />
                              </td>

                              <td>{item.price}</td>
                             
                              <td>
                            <div className="form-check form-switch d-flex justify-content-center">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={item.isActive}
                                style={{
                                  backgroundColor: item.isActive ? "green" : "red",
                                  borderColor: item.isActive ? "green" : "red",
                                }}
                                onChange={() => updateProduct(item.id, item.isActive)}
                              />
                            </div>
                          </td>

                              <td>
                                <div className="d-flex gap-2">
                                  <Link to={`/product/adminUpdateProduct/${item.id}`} className="btn btn-warning btn-sm">Edit</Link>
                                  <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => deleteProduct(item.id)}
                                  >
                                    Delete
                                  </button>
                                  
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>

                    </table>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

        <MyFooter />

      </div>

    </div>
  );
}
