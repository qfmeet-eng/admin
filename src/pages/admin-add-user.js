import MyFooter from "../all/admin-footer";
import Sidebar from "../all/admin-sidebar";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ToastContainer } from 'react-toastify';
import { showError, showMessage } from "../all/message";
import axios from 'axios';
import api from "../all/api";
export default function AdminAddUser() {

    let [name, setName] = useState('');
    let [email, setEmail] = useState('')
    let [password, setPassword]  = useState('') 
    let navigate = useNavigate();
  const saveCategory = function(e) {
    e.preventDefault();
    if (!name) {
        showError("user name is required");
        return;
    }
    if(!email) {
        showError("email is required")
        return
    }
    if(!password){
        showError("password is required")
    }
    const payload = { name: name, email:email, password:password };
    axios.post(api + "/user/register", payload)
        .then((response) => {
            if (!response.data.success) {
                showError(response.data.message);  
                return;
            }
          
            showMessage(response.data.message);
            setTimeout(() => {
                navigate("/adminUser");
            }, 1000);
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

    return (<div id="wrapper">
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
                                    <h3 className="text-light">Category management</h3>
                                    <Link to="/adminUser" className="btn btn-light">Back</Link>
                                </div>
                                <div className="card-body">
                                    <h4>Add new category</h4>
                                    <form className="needs-validation" 
                                    onSubmit={saveCategory}>
                                        <div className="mb-3">
                                            <label htmlFor="title" className="form-label">name</label>
                                            <input type="text" className="form-control" id="category" placeholder="Enter user" required 
                                            value={name} onChange={(e) => setName(e.target.value)} />
                                            <div className="invalid-feedback">
                                                Please enter a category.
                                            </div>
                                        </div>  
                                         <div className="mb-3">
                                            <label htmlFor="email" className="form-label">email</label>
                                            <input type="email" className="form-control" id="category" placeholder="Enter email" required 
                                            value={email} onChange={(e) => setEmail(e.target.value)} />
                                            <div className="invalid-feedback">
                                                Please enter a email.
                                            </div>
                                        </div>  
                                         <div className="mb-3">
                                            <label htmlFor="password" className="form-label">password</label>
                                            <input type="password" className="form-control" id="category" placeholder="Enter password" required 
                                            value={password} onChange={(e) => setPassword(e.target.value)} />
                                            <div className="invalid-feedback">
                                                Please enter a category.
                                            </div>
                                        </div>  
                                        <div className="d-flex justify-content-end">
                                            <button type="submit" className="btn btn-primary">save</button> &nbsp;
                                            <button type="reset" className="btn btn-dark" onClick={() => setName('')}>clear all</button>
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