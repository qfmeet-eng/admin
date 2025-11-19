import MyFooter from "../all/admin-footer";
import Sidebar from "../all/admin-sidebar";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../all/api";
import { ToastContainer } from "react-toastify";
import { showError, showMessage } from "../all/message";
import axios from "axios";

export default function AdminAddSubCategory() {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  // FETCH ALL CATEGORIES
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
        showError("Something went wrong");
      });
  }, []);

  // SAVE SUBCATEGORY
  const saveCategory = (e) => {
    e.preventDefault();

    if (!categoryId) {
      showError("Please select a category");
      return;
    }

    const payload = {
      name,
      categoryId,
    
    };

    axios
      .post(api + "/subCategory/createsSubCategory", payload)
      .then((response) => {
        if (!response.data.success) {
          showError(response.data.message);
          return;
        }

        showMessage("SubCategory created successfully");

        setTimeout(() => {
          navigate("/adminSubCategory");
        }, 800);
      })
       .catch((error) => {
    
            if (error.response && error.response.data) {
            
                showError(error.response.data.message || "Something went wrong");
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

          <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow"></nav>

          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="card shadow">
                  <div className="card-header bg-primary d-flex justify-content-between">
                    <h3 className="text-light">SubCategory Management</h3>
                    <Link to="/adminSubCategory" className="btn btn-light">
                      Back
                    </Link>
                  </div>

                  <div className="card-body">
                    <h4>Add New SubCategory</h4>

                    <form onSubmit={saveCategory}>
                      
                

                      {/* CATEGORY DROPDOWN */}
                      <div className="mb-3">
                        <label className="form-label">Select Category</label>
                        <select
                          className="form-control"
                          value={categoryId}
                          onChange={(e) => setCategoryId(e.target.value)}
                          required
                        >
                          <option value="">-- Select Category --</option>

                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
      {/* Subcategory Name */}
                      <div className="mb-3">
                        <label className="form-label">Title</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter subcategory name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          disabled={!categories}
                        />
                      </div>
                     

                      <div className="d-flex justify-content-end">
                        <button type="submit" className="btn btn-primary">
                          Save
                        </button>
                        &nbsp;
                        <button type="reset" className="btn btn-dark">
                          Clear
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
