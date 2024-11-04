import { useEffect, useState } from "react";
import Navbar from "../../navbar/Navbar";
import { useSelector } from "react-redux";
import del from "../../assets/delt.jpeg";
import "./users.css";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Users() {
  const { currentUser  } = useSelector((state) => state.user);
  const [showForm, setShowForm] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [userIdToDelete, setIdToDelete] = useState(null); // For storing the ID of the user to delete

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/getAllUsers");
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

  const handleDeleteUser  = async () => {
    if (!userIdToDelete) return; // Prevent deletion if no ID is set

    try {
      const response = await fetch(`http://localhost:8000/users/${userIdToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update state to remove the deleted user
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userIdToDelete));
      setShowModal(false);
      alert("User  deleted successfully");
    } catch (error) {
      console.error('Error deleting user:', error);
     
    }
  };

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showModal]);

  return (
    <div>
      <Navbar />
      <h1>Users</h1>
      {loading && <p>Loading users...</p>}
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
          <div className="totalNum">
            <p>Filter</p>
          </div>
          <div className="totalNum">
            <p>PDF</p>
          </div>
          <div className="totalNum" onClick={() => setShowForm(true)}>
            <p>ADD USER</p>
          </div>
          <div className="totalNum" onClick={fetchUsers}>
            <p>Refresh</p>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="addUsers">
          <form action="">
            <div className="btn-close" onClick={() => setShowForm(false)}>
              X
            </div>
            <input type="text" id="name" placeholder="Name" />
            <input type="email" id="email" placeholder="Email" />
            <input type="password" id="password" placeholder="Password" />
            <input type="text" id="role" placeholder="Role" />
            <button type="submit">Add</button>
          </form>
        </div>
      )}

      <div className="flex justify-content-center align-items-center col mt-1">
        {currentUser .isAdmin && users.length > 0 ? (
          <div className="table-responsive bg-light px-5 text-white rounded">
 <table className="table table-responsive table-light table-hover table-striped rounded-3">
              <thead>
                <tr>
                  <th scope="col">N.</th>
                  <th scope="col">Pictures</th>
                  <th scope="col">Names</th>
                  <th scope="col">Email</th>
                  <th scope="col">Roles</th>
                  <th scope="col">Delete </th>
                  <th scope="col">Edit</th>
                </tr>
              </thead>
              <tbody>
                {users
                  .filter((user) => {
                    if (searchTerm === "") {
                      return user;
                    } else if (
                      user.username.toLowerCase().includes(searchTerm.toLowerCase())
                    ) {
                      return user;
                    }
                  })
                  .map((user, index) => (
                    <tr key={user._id}>
                      <th scope="row">{index + 1}</th>
                      <td>
                        <img
                          src={user.profilePicture}
                          alt=""
                          className="img-fluid rounded-circle"
                        />
                      </td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>{user.isAdmin ? "Admin" : "User "}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => {
                            console.log("Deleting user with ID:", user._id);
                             setIdToDelete(user._id);
                            setShowModal(true);
                          }}
                        >
                          Delete
                        </button>
                      </td>
                      <td>
                        <Link to={`/edituser/${user._id}`}>Edit</Link>
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
          <div className="modal-content">
            <img src={del} alt="" />
            <h4>Delete User</h4>
            <p>Are you sure you want to delete this user? </p>
            <div className="modal-buttons">
              <button onClick={handleDeleteUser }>Yes, I am sure</button>
              <button onClick={() => setShowModal(false)}>No, keep it</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}