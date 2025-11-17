import MyFooter from "../all/admin-footer";
import Sidebar from "../all/admin-sidebar";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import { useEffect, useState } from "react";
import api from "../all/api";
import { ToastContainer } from 'react-toastify';
import { showError, showMessage } from "../all/message";

export default function AdminEditCategory() {
  const { id } = useParams(); // Get category ID from route
  const [name, setName] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isFetched) {
      axios.get(`${api}/category/getCategoryById/${id}`)
        .then(res => {
          if (!res.data.success) {
            showError(res.data.message);
            return;
          }
          setName(res.data.data.name);
          setIsActive(res.data.data.isActive);
          setIsFetched(true);
        })
        .catch(err => {
          console.log(err);
          if (err.response?.data?.message) showError(err.response.data.message);
          else showError("Something went wrong");
        });
    }
  }, [id, isFetched]);

  // Update category
  const updateCategory = (e) => {
    e.preventDefault();

    if (!name) {
      showError("Category name is required");
      return;
    }

    const payload = { name  };

    axios.put(`${api}/category/updateCategory/${id}`, payload)
      .then(res => {
        if (!res.data.success) {
          showError(res.data.message);
              return;
        }
        showMessage(res.data.message);
        setTimeout(() => {
          navigate("/adminCategory");
        }, 1000);
      })
      .catch(err => {
        console.log(err);
        if (err.response?.data?.message) showError(err.response.data.message);
        else showError("Something went wrong");
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
                    <h3 className="text-light">Category Management</h3>
                    <Link to="/adminCategory" className="btn btn-light">Back</Link>
                  </div>
                  <div className="card-body">
                    <h4>Edit Category</h4>
                    <form onSubmit={updateCategory}>
                      <div className="mb-3">
                        <label htmlFor="category" className="form-label">Category Name</label>
                        <input
                          type="text"
                          className="form-control"
                          id="category"
                          placeholder="Enter category"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                    
                      <div className="d-flex justify-content-end">
                        <button type="submit" className="btn btn-primary">Save Changes</button> &nbsp;
                        <button type="reset" className="btn btn-dark" onClick={() => setName('')}>Clear All</button>
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
