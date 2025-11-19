    import MyFooter from "../all/admin-footer";
    import Sidebar from "../all/admin-sidebar";
    import api from "../all/api";
    import { showMessage, showError } from "../all/message";
    import { Link, useNavigate, useParams } from "react-router-dom";
    import { useState, useEffect } from "react";
    import { ToastContainer } from "react-toastify";
    import axios from "axios";

    export default function AdminEditProduct() {
      const { id } = useParams();
      const navigate = useNavigate();

      // States
      const [name, setName] = useState('');
      const [price, setPrice] = useState('');
      const [categoryId, setCategoryId] = useState('');
      const [subCategoryId, setSubCategoryId] = useState('');
      const [detail, setDetail] = useState('');
      const [image, setImage] = useState(null); // New image file
      const [imagePreview, setImagePreview] = useState(null); // Preview of selected image
      const [oldImage, setOldImage] = useState(null); // Existing image
      const [categories, setCategories] = useState([]);
      const [subcategories, setSubCategories] = useState([]);
      const [isFetched, setIsFetched] = useState(false);

      // Fetch categories
      useEffect(() => {
        axios.get(`${api}/category/dropdownCategory`)
          .then((response) => {
            if (response.data.success) {
              setCategories(response.data.data);
            } else {
              showError("Unable to load categories");
            }
          })
          .catch((error) => {
            console.log(error);
            showError("Something went wrong while loading categories");
          });
      }, []);

      // Fetch subcategories
      useEffect(() => {
        axios.get(`${api}/subcategory/getSubCategoryDrop`)
          .then((res) => {
            if (res.data.success) {
              setSubCategories(res.data.data);
            } else {
              showError("Unable to load subcategories");
            }
          })
          .catch((error) => {
            console.log(error);
            showError("Something went wrong while loading subcategories");
          });
      }, []);

      // Fetch product data
      useEffect(() => {
        if (!isFetched && id) {
          axios.get(`${api}/product/getProductById/${id}`)
            .then((res) => {
              if (!res.data.success) {
                showError(res.data.message);
                return;
              }
              const produ = res.data.data;
              setName(produ.name || '');
              setPrice(produ.price || '');
            setCategoryId(produ.categoryId?._id || produ.categoryId?.id || "");
setSubCategoryId(produ.subCategoryId?._id || produ.subCategoryId?.id || "");
              
              setOldImage(produ.image || null);
              setIsFetched(true);
            })
          .catch(err => {
              console.log(err);
              if (err.response?.data?.message) showError(err.response.data.message);
              else showError("Something went wrong");
            });
        }
      }, [id, isFetched]);

      // Update product
      const updateProduct = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", name);
        formData.append("price", price);
        formData.append("categoryId", categoryId);
        formData.append("subCategoryId", subCategoryId);
        formData.append("detail", detail);

        if (image instanceof File) {
          formData.append("image", image);
        }

        axios.put(`${api}/product/updateProduct/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        })
          .then((response) => {
            if (!response.data.success) {
              showError(response.data.message);
              return;
            }
            showMessage("Product updated successfully");
            setTimeout(() => {
              navigate("/adminProduct");
            }, 800);
          })
          .catch((error) => {
            console.log(error);
            showError("Something went wrong while updating product");
          });
      };

      return (
        <div id="wrapper">
          <Sidebar />
          <div id="content-wrapper" className="d-flex flex-column">
            <div id="content">
              <ToastContainer />
              <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                <form className="form-inline" onSubmit={updateProduct}>
                  <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
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
                        <Link to="/adminProduct" className="btn btn-light">Back</Link>
                      </div>

                      <div className="card-body">
                        <h3>Edit Product</h3>
                        <form className="needs-validation" onSubmit={updateProduct}>
                          <div className="row mb-3">
                            <div className="col-md-6">
                              <label className="form-label">Select Category</label>
                              <select
      className="form-control"
      value={categoryId}
      onChange={(e) => setCategoryId(e.target.value)}
      required
    >
      <option value="">-- Select Category --</option>
      {categories.map((cat) => (
       <option key={cat._id || cat.id} value={cat._id || cat.id}>

          {cat.name|| cat._name}
        </option>
      ))}
    </select>
                            </div>
                              <div className="col-md-6">
                              <label className="form-label">Select SubCategory</label>
                            <select
      className="form-control"
      value={subCategoryId}
      onChange={(e) => setSubCategoryId(e.target.value)}
      required
    >
      <option value="">-- Select SubCategory --</option>
      {subcategories.map((sub) => (
       <option key={sub._id || sub.id} value={sub._id || sub.id}>

          {sub.name || sub._name}
        </option>
      ))}
    </select>
                            </div>
                            <div className="col-md-6">
                              <label htmlFor="title" className="form-label">Edit Title</label>
                              <input
                                type="text"
                                className="form-control"
                                id="title"
                                placeholder="Enter title"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                              />
                            </div>
                            <div className="col-md-3">
                              <label htmlFor="price" className="form-label">Edit Price</label>
                              <input
                                type="number"
                                className="form-control"
                                id="price"
                                placeholder="Enter price"
                                min={0}
                                step="0.01"
                                required
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                              />
                            </div>
                          </div>

                          

                          <div className="row mb-3">
                            <div className="col-md-4">
                              <label htmlFor="photo" className="form-label">Change Photo</label>
                              <input
                                type="file"
                                className="form-control"
                                id="photo"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  setImage(file);
                                  setImagePreview(URL.createObjectURL(file));
                                }}
                              />

                              <b>Existing / Preview Photo</b> <br />
                          {imagePreview ? (
      <img src={imagePreview} alt="Preview" height="200px" className="mt-2" />
    ) : oldImage ? (
      <img src={`${api}/uploads/${oldImage}`} alt="Existing" height="200px" className="mt-2" />
    ) : null}

                            </div>

                            
                          </div>

                          <div className="d-flex justify-content-end">
                            <button type="submit" className="btn btn-primary">Save Changes</button>
                            &nbsp;
                            <button type="reset" className="btn btn-dark" onClick={() => {
                              setName('');
                              setPrice('');
                              setCategoryId('');
                              setSubCategoryId('');
                              setDetail('');
                              setImage(null);
                              setImagePreview(null);
                            }}>Clear All</button>
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
