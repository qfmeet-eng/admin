import MyFooter from "../all/admin-footer";
import Sidebar from "../all/admin-sidebar";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../all/api";
import { ToastContainer } from "react-toastify";
import { showError, showMessage } from "../all/message";
import axios from "axios";

export default function AdminEditSubCategory() {
  const { id } = useParams();

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [isFetched, setIsFetched] = useState(false);

  const navigate = useNavigate();

  // LOAD CATEGORY DROPDOWN
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
      .catch(() => showError("Something went wrong"));
  }, []);

  // GET SUBCATEGORY DATA
  useEffect(() => {
    if (!isFetched && id) {
      axios
        .get(`${api}/subCategory/getSubCategoryById/${id}`)
        .then((res) => {
          if (!res.data.success) {
            showError(res.data.message);
            return;
          }
          const subCat = res.data.data;
          setName(subCat.name);
          setCategoryId(subCat.categoryId?.id || "");  
          setIsFetched(true);
        })
        .catch((err) => {
          console.log(err);
          showError("Something went wrong");
        });
    }
  }, [id, isFetched]);

  const updateCategory = (e) => {
    e.preventDefault();
    const payload = {
      name,
      categoryId, 
    };
    axios
      .put(api + `/subCategory/updateSubCategory/${id}`, payload)
      .then((response) => {
        if (!response.data.success) {
          showError(response.data.message);
          return;
        }
        showMessage("SubCategory updated successfully");
        setTimeout(() => {
          navigate("/adminSubCategory");
        }, 800);
      })
      .catch(() => showError("Something went wrong"));
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
                    <h3 className="text-light">Edit SubCategory</h3>
                    <Link to="/adminSubCategory" className="btn btn-light">
                      Back
                    </Link>
                  </div>

                  <div className="card-body">
                    <form onSubmit={updateCategory}>

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
                            <option key={cat.id} value={cat.id}> {/* FIXED KEY */}
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* SUBCATEGORY NAME */}
                      <div className="mb-3">
                        <label className="form-label">Title</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter subcategory name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>

                      <div className="d-flex justify-content-end">
                        <button type="submit" className="btn btn-primary">
                          Update
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
