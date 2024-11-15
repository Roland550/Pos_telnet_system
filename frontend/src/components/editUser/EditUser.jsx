import  { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import './editUser.css'
import { editUserStart ,} from '../../redux/user/userSlice';
import Navbar from '../../navbar/Navbar';

import { useParams } from 'react-router-dom';

export default function EditUser() {
    const {currentUser} = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [publishError, setPublishError] = useState(null);
  const [formData, setFormData] = useState({});
   const editId = useParams()

  
  useEffect(() => { 
    
  const fetchUser = async () => {
    try {
      const res = await fetch(`http://localhost:8000/getAllUsers?editId=${editId}`);
      const data = await res.json();
      if (res.ok) {
        setFormData(data);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  fetchUser();
  }, [editId]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Use FormData to handle file uploads
    const updateData = new FormData();
    updateData.append("username", formData.username);
    updateData.append("email", formData.email);
  
    try {
      dispatch(editUserStart());
      const res = await fetch(`https://pos-backend-bs8i.onrender.com/api/user/update/${formData._id}/${currentUser._id}`, {
        method: "PUT",
        body: updateData,
      });
  
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
  
      setPublishError(null);
      alert("User updated successfully!");
      
    } catch (error) {
      setPublishError("Something went wrong during update.");
      console.log(error);
    }
  };
  return (
    <div>
        <Navbar />
      
            <div className='form-addpage'>
              <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={formData.username || ''}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="add_input"
              />
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="add_input"
              />
              <button type="submit" className="add_input">Save</button>
              </form>
              {publishError && <p>{publishError}</p>}
            </div>

          
    </div>
      
    
  )
}
