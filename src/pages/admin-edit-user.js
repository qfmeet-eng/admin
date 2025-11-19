import MyFooter from "../all/admin-footer";
import Sidebar from "../all/admin-sidebar";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { showError, showMessage } from "../all/message";
import axios from 'axios';
import api from "../all/api";

export default function AdminEditUser() {
  const [name, setName] = useState('');
 
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();  

  // Fetch user by ID
  useEffect(() => {
    axios.get(`${api}/user/getUserById/${id}`)
      .then((response) => {
        if (!response.data.success) {
          showError(response.data.message);
          return;
        }
        const user = response.data.data;
        setName(user.name);
      })
      .catch((err) => {
        showError(err.response?.data?.message || "Unable to fetch user data");
      });
  }, [id]);

  const saveUser = (e) => {
    e.preventDefault();

    if (!name) return showError("User name is required");
   

    const payload = { name};
    if (password) payload.password = password;  

    axios.put(`${api}/user/updateUser/${id}`, payload)
      .then((response) => {
        if (!response.data.success) {
          showError(response.data.message);
          return;
        }

        showMessage("User updated successfully");
        setTimeout(() => {
          navigate("/adminUser");
        }, 1000);
      })
      .catch((error) => {
        showError(error.response?.data?.message || "Something went wrong");
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
            <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
              <i className="fa fa-bars" />
            </button>
          </nav>

          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="card shadow">
                  <div className="card-header bg-primary d-flex justify-content-between">
                    <h3 className="text-light">Edit User</h3>
                    <Link to="/adminUser" className="btn btn-light">Back</Link>
                  </div>
                  <div className="card-body">
                    <form className="needs-validation" onSubmit={saveUser}>
                      <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input type="text" className="form-control" id="name" 
                          value={name} onChange={(e) => setName(e.target.value)} required />
                      </div>

                      

                      <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" className="form-control" id="password" 
                          value={password} onChange={(e) => setPassword(e.target.value)} />
                      </div>

                      <div className="d-flex justify-content-end">
                        <button type="submit" className="btn btn-primary">Save</button>
                        &nbsp;
                        <button type="reset" className="btn btn-dark" onClick={() => { setName('');    setPassword(''); }}>Clear All</button>
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
