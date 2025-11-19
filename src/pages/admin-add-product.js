import MyFooter from "../all/admin-footer";
import Sidebar from "../all/admin-sidebar";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { showError, showMessage } from "../all/message";
import axios from "axios";
import api from "../all/api";

export default function AdminAddProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubCategories] = useState([]);

  const navigate = useNavigate();

  // Load categories
  useEffect(() => {
    axios
      .get(api + "/category/dropdownCategory")
      .then((res) => {
        if (res.data.success) {
          setCategories(res.data.data);
        } else {
          showError("Unable to load categories");
        }
      })
      .catch((err) => {
        console.log(err);
        showError("Something went wrong while loading categories");
      });
  }, []);

  // Load subcategories
  useEffect(() => {
    axios
      .get(api + "/subCategory/getSubCategoryDrop")
      .then((res) => {
        if (res.data.success) {
          setSubCategories(res.data.data);
        } else {
          showError("Unable to load subcategories");
        }
      })
      .catch((err) => {
        console.log(err);
        showError("Something went wrong while loading subcategories");
      });
  }, []);

 
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const saveProduct = (e) => {
    e.preventDefault();

    if (!categoryId) {
      showError("Please select a category");
      return;
    }
    if (!subCategoryId) {
      showError("Please select a subcategory");
      return;
    }
    if (!name.trim()) {
      showError("Please enter product name");
      return;
    }
    if (!price) {
      showError("Please enter price");
      return;
    }
    if (!image){
        showError("please upload image")
        return  
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("categoryId", categoryId);
    formData.append("subCategoryId", subCategoryId);

    if (image) {
      formData.append("image", image);
    }

    axios
      .post(api + "/product/createProduct", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        if (!res.data.success) {
          showError(res.data.data || res.data.message);
          return;
        }
        showMessage("Product created successfully");
        setTimeout(() => navigate("/adminProduct"), 800);
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          const data = error.response.data.data;
          if (data && typeof data === "object") {
            const messages = Object.values(data)
              .map((err) => err.message)
              .join(", ");
            showError(messages || error.response.data.message);
          } else {
            showError(error.response.data.message || "Something went wrong");
          }
        } else {
          showError("Something went wrong. Please try again");
        }
        console.log(error);
      });
  };

  return (
    <div id="wrapper">
      <Sidebar />
      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
          <ToastContainer />
          <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
            <form className="form-inline">
              <button
                id="sidebarToggleTop"
                className="btn btn-link d-md-none rounded-circle mr-3"
              >
                <i className="fa fa-bars" />
              </button>
            </form>
          </nav>

          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="card shadow">
                  <div className="card-header bg-primary d-flex justify-content-between">
                    <h3 className="text-light">Product Management</h3>
                    <Link to="/adminProduct" className="btn btn-light">
                      Back
                    </Link>
                  </div>
                  <div className="card-body">
                    <h3>Add New Product</h3>
                    <form
                      className="needs-validation"
                      onSubmit={saveProduct}
                      noValidate
                    >
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label htmlFor="category" className="form-label">
                            Category
                          </label>
                          <select
                            id="category"
                            className="form-control"
                            value={categoryId}
                            onChange={(e) => {
                              setCategoryId(e.target.value);
                              setSubCategoryId(""); 
                            }}
                          >
                            <option value="">-- Select Category --</option>
                            {categories.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="col-md-6">
                          <label htmlFor="subcategory" className="form-label">
                            SubCategory
                          </label>
                          <select
                            id="subcategory"
                            className="form-control"
                            value={subCategoryId}
                            onChange={(e) => setSubCategoryId(e.target.value)}
                            disabled={!categoryId}
                          >
                            <option value="">-- Select SubCategory --</option>
                            {subcategories
                              
                              .map((item) => (
                                <option key={item.id} value={item.id}>
                                  {item.name}
                                </option>
                              ))}
                          </select>
                        </div>

                        <div className="col-md-6 mt-3">
                          <label htmlFor="title" className="form-label">
                            Product Name
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="title"
                            placeholder="Enter Product Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={!subCategoryId}
                          />
                        </div>

                        <div className="col-md-3 mt-3">
                          <label htmlFor="price" className="form-label">
                            Price
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            id="price"
                            placeholder="Enter price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            min={0}
                            step="0.01"
                          />
                        </div>
                      </div>

                      <div className="row mb-3">
                        <div className="col-md-4">
                          <label htmlFor="photo" className="form-label">
                            Photo
                          </label>
                          <input
                            type="file"
                            className="form-control"
                            id="photo"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              setImage(file);
                              setImagePreview(file ? URL.createObjectURL(file) : null);
                            }}
                          />
                          {imagePreview && (
                            <div className="mt-2">
                              <img
                                src={imagePreview}
                                alt="Preview"
                                style={{
                                  width: "150px",
                                  height: "150px",
                                  objectFit: "cover",
                                  borderRadius: "5px",
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="d-flex justify-content-end">
                        <button type="submit" className="btn btn-primary">
                          Save
                        </button>{" "}
                        &nbsp;
                        <button
                          type="reset"
                          className="btn btn-dark"
                          onClick={() => {
                            setName("");
                            setPrice("");
                            setImage(null);
                            setImagePreview(null);
                            setCategoryId("");
                            setSubCategoryId("");
                          }}
                        >
                          Clear All
                        </button>
                      </div>
                    </form>
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
