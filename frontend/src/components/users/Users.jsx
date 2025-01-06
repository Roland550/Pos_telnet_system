import { useEffect, useState } from "react";
import Navbar from "../../navbar/Navbar";
import { useSelector, useDispatch } from "react-redux";
import del from "../../assets/delt.jpeg";
import "./users.css";
import { Link } from "react-router-dom";
import { MdDelete, MdEdit } from "react-icons/md";

import axios from "axios";
import { toast } from "react-toastify";
import { deleteUserSuccess, deleteUserFailed, deleteUserStart } from "../../redux/user/userSlice.js";

export default function Users() {
  const { currentUser } = useSelector((state) => state.user);
  const [showForm, setShowForm] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteToUserId, setDeleteToUserId] = useState(null); // Store the ID of the user to delete

  const dispatch = useDispatch();

  const toastOptions = {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  };

  const fetchUsers = async () => {
    try {

      const response = await axios.get("https://pos-backend-bs8i.onrender.com/getAllUsers");
      setUsers(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser .isAdmin) {
      fetchUsers();
    }
  }, [currentUser ]);

  const handleDeleteUser = async () => {
    console.log('handleDeleteUser called');
    try {
      dispatch(deleteUserStart());
      const res = await fetch(
        `https://pos-backend-bs8i.onrender.com/deleteUser/${deleteToUserId}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      console.log('data:', data);
      if (res.ok) {
        setUsers((prev) => (prev ? prev.filter((user) => user._id !== deleteToUserId) : []))
        toast.success("User deleted successfully", toastOptions);
        dispatch(deleteUserSuccess(data));
        setShowModal(false);
        
      } else {
        dispatch(deleteUserFailed(data.message));
        console.error(data.message);
      }
    } catch (error) {
      dispatch(deleteUserFailed(error.message));
      console.error(error.message);
    } finally {
      setTimeout(() => {
        dispatch(deleteUserStart(false));
      }, 200);
    }
  };

  const handleUser = async (event) => {
    event.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      toast.error("All fields are required please", toastOptions);
      return;
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch("https://pos-backend-bs8i.onrender.com/api/user/signup", {
        method: "POST",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify(formData),
      });
      const isJson = res.headers
      .get("content-type")
      ?.includes("application/json");
    const data = isJson ? await res.json() : {};
      
      if (data.success === false) {
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if (res.ok) {
        toast.success("User created successfully", toastOptions);
        setFormData("");
        
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }

  }
  return (
    <div>
      <Navbar />
      <h1>Users</h1>
      {loading && <p>{toast.loading}Loading users...</p>}
      {error && <p>Error: {error}</p>}
      <div className="list-items">
        <div className="search-list">
          <input
            type="text"
            id="bill"
            placeholder="Search..."
            className="input-list"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="total-item">
          <div className="totalNum" onClick={() => toast.info("This feature is coming soon...")}>
            <p>Filter</p>
          </div>
          <div className="totalNum" onClick={() => toast.info("This feature is coming soon...")}>
            <p>PDF</p>
          </div>
          <div className="totalNum" onClick={() => setShowForm(true)}>
            <p>ADD</p>
          </div>
          
        </div>
      </div>

      {showForm && (
        <div className="addUsers">
          <form onSubmit={handleUser}>
            <div className="btn-close" onClick={() => setShowForm(false)}>
              X
            </div>
            <input type="text" id="username" placeholder="Name" onChange={(e) => setFormData({...formData, username: e.target.value})}/>
            <input type="email" id="email" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} />

            <select name="" id="password" className="password20" onChange={(e) => setFormData({...formData, password: e.target.value})}>
            <option value="disabled selected">Grant user password</option>
            <option value="telnet@oct2024">Telnet@oct2024</option>
            <option value="telnet@nov2024">Telnet@nov2024</option>
            <option value="telnet@dec2024">Telnet@dec2024</option>
            <option value="telnet@jan2025">Telnet@jan2025</option>
          </select>
           
            <button type="submit">
            {loading ?(
                  <>
                  <span className="spinner-border spinner-border-sm"></span>
                  </>
                ): "Add user"}
            </button>
            {errorMessage && <p>{errorMessage}</p>}
          </form>
        </div>
      )}

      <div className="flex justify-content-center align-items-center col mt-1">
        {currentUser.isAdmin && users.length > 0 ? (
          <div className="mt-1 table-responsive bg-light">
            <table className="table table-responsive table-light table-hover table-striped rounded-3">
              <thead>
                <tr>
                  <th scope="col">N.</th>
                  <th scope="col">Date</th>
                  <th scope="col" className="px-5">Pictures</th>
                  <th scope="col">Names</th>
                  <th scope="col">Email</th>
                  <th scope="col">Roles</th>
                  <th scope="col">Delete</th>
                  <th scope="col">Edit</th>
                </tr>
              </thead>
              <tbody>
                {users
                  .filter((user) => {
                    if (searchTerm === "") {
                      return user;
                    } else if (
                      user.username
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    ) {
                      return user;
                    }
                  })
                  .map((user, index) => (
                    <tr key={user._id}>
                      <th scope="row">{index + 1}</th>
                      <td>{new Date(user.updatedAt).toLocaleDateString()}</td>
                      <td className="sm:m-2">
                        <img
                          src={user.profilePicture}
                          alt=""
                          className="user-img"
                        />
                      </td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>{user.isAdmin ? "Admin" : "User "}</td>
                      <td>
                        <button
                          className="del_btn"
                          onClick={() => {
                            // Set the user ID to delete
                            console.log(user._id);
                            setShowModal(true); // Show the modal for confirmation
                            setDeleteToUserId(user._id);
                          }}
                        >
                          <MdDelete size={27} />
                        </button>
                      </td>
                      <td>
                        <Link className="edit_btn" to={`/editUser/${user._id}`}>
                          
                            <MdEdit size={27} />
                      
                        </Link>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <h2 className="px-2 text-dark">
              Total Number of users: {users.length}
            </h2>
          </div>
        ) : (
          <p className="text-center">No users found</p>
        )}
      </div>
      {showModal && (
        <div className="modal-container" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={del} alt="" />
            <h4>Delete User</h4>
            <p>Are you sure you want to delete this user?</p>
            <div className="modal-buttons">
              <button onClick={()=>{
                // dispatch(deleteUser(deleteToUserId));
                console.log('delete button clicked');
                handleDeleteUser();
                setShowModal(false);
              }}>Yes, I am sure</button>
              <button onClick={() => setShowModal(false)}>No, keep it</button>
            </div>
          </div>
        </div>

      )}
    </div>
  );
}
