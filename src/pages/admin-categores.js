import MyFooter from "../all/admin-footer";
import Sidebar from "../all/admin-sidebar";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import api from "../all/api";
import { ToastContainer } from "react-toastify";
import { showError, showMessage } from "../all/message";

export default function AdminCategory() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get(api + "/category/dropdownCategory")
      .then((response) => {
        if (!response.data.success) {
          showError(response.data.message);
          return;
        }
        setCategories(response.data.data);
        showMessage("Data fetched");
      })
      .catch((error) => {
        console.log(error);
        showError("Unable to fetch categories. Please try again.");
      });
  }, []);

  const deleteCategory = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this category?");
    if (!confirmDelete) return;

    axios
      .delete(api + "/category/deleteCategory/" + id)
      .then((response) => {
        if (!response.data.success) {
          showError(response.data.message);
          return;
        }

        const newList = categories.filter((item) => item.id !== id);
        setCategories(newList);

        showMessage(response.data.message);
      })
      .catch((error) => {
        console.log(error);
        showError("Unable to delete category. Please try again.");
      });
  };

  const updateCategory = (id, currentValue) => {
    const payload = { isActive: !currentValue };

    axios
      .put(api + "/category/updateCategory/" + id, payload)
      .then((response) => {
        if (!response.data.success) {
          showError(response.data.message);
          return;
        }

        const updatedList = categories.map((cat) =>
          cat.id === id ? { ...cat, isActive: !currentValue } : cat
        );

        setCategories(updatedList);
        showMessage("Category updated");
      })
      .catch((error) => {
        console.log(error);
        showError("Unable to update category. Please try again.");
      });
  };

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
                    <h3 className="text-light">Category Management</h3>
                    <Link to="/category/adminAddCategory" className="btn btn-light">
                      Add Category
                    </Link>
                  </div>

                  <div className="card-body">
                    <table className="table table-bordered table-striped">
                      <thead>
                        <tr>
                          <th width="10%">Sr No</th>
                          <th>Name</th>
                          <th width="10%">Active</th>
                          <th width="10%">Edit</th>
                          <th width="10%">Delete</th>
                        </tr>
                      </thead>

                      <tbody>
                        {categories.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="text-center text-danger">
                              No categories found
                            </td>
                          </tr>
                        ) : (
                          categories.map((item, index) => (
                            <tr key={item.id}>
                              <td>{index + 1}</td>
                              <td>{item.name}</td>

                              <td>
                                <div className="form-check form-switch d-flex justify-content-center align-items-center">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={item.isActive === true}
                                    style={{backgroundColor:item.isActive === true ? "green":"red",
                                        borderColor:item.isActive === true ? "green":"red"
                                    }}
                                    onChange={() => updateCategory(item.id, item.isActive)}
                                  />
                                </div>
                              </td>

                              <td>
                                <Link
                                  to={`/category/adminEditCategory/${item.id}`}
                                  className="btn btn-warning"
                                >
                                  Edit
                                </Link>
                              </td>

                              <td>
                                <button className="btn btn-danger" onClick={() => deleteCategory(item.id)}>
                                  Delete
                                </button>
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
