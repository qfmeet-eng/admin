import { Link } from "react-router-dom";
import MyFooter from "../all/admin-footer";
import Sidebar from "../all/admin-sidebar";
import { useEffect, useState } from "react";
import axios from "axios";
import api from "../all/api";
import { ToastContainer } from 'react-toastify';
import { showError, showMessage } from "../all/message";

export default function AdminUser() {
  const [users, setUsers] = useState([]);

  // Fetch all users
  const fetchUsers = () => {
    axios.get(`${api}/user/getData`)
      .then((response) => {
        if (!response.data.success) {
          showError(response.data.message);
          return;
        }
        setUsers(response.data.data); 
        showMessage("User data fetched successfully");
      })
      .catch((error) => {
        showError(error.response?.data?.message || "Unable to fetch users");
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete user
  const deleteUser = async (_id) => {
    if (!window.confirm("Are you sure you want to delete this User?")) return;

    axios.delete(`${api}/user/deleteUser/${_id}`)
      .then((response) => {
        if (!response.data.success) {
          showError(response.data.message);
          return;
        }
        showMessage("User deleted successfully");
        setUsers(users.filter((user) => user._id !== _id));
      })
      .catch((err) => {
        showError(err.response?.data?.message || "Unable to delete user");
      });
  };

  // Update user active status
  const updateUsers = (_id, currentValue) => {
    const payload = { isActive: !currentValue };

    axios.put(`${api}/user/updateUser/${_id}`, payload)
      .then((response) => {
        if (!response.data.success) {
          showError(response.data.message);
          return;
        }

        const updatedList = users.map((user) =>
          user._id === _id ? { ...user, isActive: !currentValue } : user
        );

        setUsers(updatedList);
        showMessage("User updated successfully");
      })
      .catch((error) => {
        console.log(error);
        showError("Unable to update user. Please try again.");
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
                    <h3 className="text-light">User Management</h3>
                    <Link to="/user/adminAddUser" className="btn btn-light">
                      Add User
                    </Link>
                  </div>

                  <div className="card-body">
                    <table className="table table-bordered table-striped">
                      <thead>
                        <tr>
                          <th width="10%">Sr No</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th width="10%">Active</th>
                          <th width="10%">Edit</th>
                          <th width="10%">Delete</th>
                        </tr>
                      </thead>

                      <tbody>
                        {users.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="text-center text-danger">
                              No users found
                            </td>
                          </tr>
                        ) : (
                          users.map((item, index) => (
                            <tr key={item._id}>
                              <td>{index + 1}</td>
                              <td>{item.name}</td>
                              <td>{item.email}</td>
                              <td>
                                <div className="form-check form-switch d-flex justify-content-center align-items-center">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={item.isActive === true}
                                    style={{
                                      backgroundColor: item.isActive ? "green" : "red",
                                      borderColor: item.isActive ? "green" : "red",
                                    }}
                                    onChange={() => updateUsers(item._id, item.isActive)}
                                  />
                                </div>
                              </td>

                              <td>
                                <Link
                                  to={`/user/adminEditUser/${item._id}`}
                                  className="btn btn-warning"
                                >
                                  Edit
                                </Link>
                              </td>

                              <td>
                                <button
                                  className="btn btn-danger"
                                  onClick={() => deleteUser(item._id)}
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
          </div>

        </div>

        <MyFooter />
      </div>
    </div>
  );
}
