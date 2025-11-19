import MyFooter from "../all/admin-footer";
import Sidebar from "../all/admin-sidebar";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import api from "../all/api";
import { ToastContainer } from "react-toastify";
import { showError, showMessage } from "../all/message";

export default function AdminSubCategory() {
  const [subCategories, setSubCategories] = useState([]);

  // GET SUBCATEGORY LIST
  useEffect(() => {
    axios
      .get(api + "/subCategory/getSubCategoryDrop")
      .then((res) => {
        if (!res.data.success) {
          showError(res.data.message || "Error fetching data");
          return;
        }

        setSubCategories(res.data.data);
        showMessage("Data fetched");
      })
      .catch((err) => {
        showError(err.response?.data?.message || "Unable to fetch categories");
      });
  }, []);

  // DELETE SUBCATEGORY
  const deleteCategory = (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    axios
      .delete(api + "/subCategory/deleteSubCategory/" + id)
      .then((res) => {
        if (!res.data.success) {
          showError(res.data.message || "Delete failed");
          return;
        }

        setSubCategories(subCategories.filter((item) => item.id !== id));
        showMessage("Category deleted");
      })
      .catch((err) => {
        showError(err.response?.data?.message || "Unable to delete category");
      });
  };

  // UPDATE SUBCATEGORY STATUS
  const updateCategory = (id, isActive) => {
    const payload = { isActive: !isActive };

    axios
      .put(api + "/subCategory/updateSubCategory/" + id, payload)
      .then((res) => {
        if (!res.data.success) {
          showError(res.data.message || "Update failed");
          return;
        }

        const updatedData = subCategories.map((item) =>
          item.id === id ? { ...item, isActive: !isActive } : item
        );

        setSubCategories(updatedData);
        showMessage("Status Updated");
      })
      .catch((err) => {
        showError(err.response?.data?.message || "Unable to update category");
      });
  };

  return (
    <div id="wrapper">
      <Sidebar />
      <div id="content-wrapper" className="d-flex flex-column">
        <ToastContainer />

        <div id="content">
          {/* Top Bar */}
          <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow"></nav>

          <div className="container-fluid">
            <div className="card shadow">
              <div className="card-header bg-primary d-flex justify-content-between">
                <h3 className="text-light">SubCategory Management</h3>
                <Link to="/subCategory/adminAddSubCategory" className="btn btn-light">
                  Add SubCategory
                </Link>
              </div>

              <div className="card-body">
                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th width="10%">Sr No</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th width="10%">Active</th>
                      <th width="10%">Edit</th>
                      <th width="10%">Delete</th>
                    </tr>
                  </thead>

                  <tbody>
                    {subCategories.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center text-danger">
                          No subcategories found
                        </td>
                      </tr>
                    ) : (
                      subCategories.map((item, index) => (
                        <tr key={item.id}>
                          <td>{index + 1}</td>
                          <td>{item.name}</td>
                          <td>{item.categoryId?.name || "No Category"}</td>

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
                                onChange={() => updateCategory(item.id, item.isActive)}
                              />
                            </div>
                          </td>

                          <td>
                            <Link
                              to={`/subCategory/adminEditCategory/${item.id}`}
                              className="btn btn-warning"
                            >
                              Edit
                            </Link>
                          </td>

                          <td>
                            <button
                              className="btn btn-danger"
                              onClick={() => deleteCategory(item.id)}
                            >
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

        <MyFooter />
      </div>
    </div>
  );
}
