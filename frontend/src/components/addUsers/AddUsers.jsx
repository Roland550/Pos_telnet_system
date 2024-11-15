import { useState } from "react";
import Navbar from "../../navbar/Navbar";
import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";

export default function AddUsers() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const toastOptions = {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  }

  // const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.id]: event.target.value.trim(),
    });
  };

  const handleSubmit = async (event) => {
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
  };
  return (
    <div>
      <Navbar />
      <h1>Add Users</h1>
      <div className="add_container">
       <div className="form-addpage">
       <form   onSubmit={handleSubmit}>
          
          <input
            type="text"
            
            id="username"
            placeholder="Employee name"
            className="add_input"
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder="Employee email"
            className="add_input"
            id="email"
            onChange={handleChange}
          />
         
      

        
        <select name="" id="password" className="add_input" onChange={handleChange}>
            <option value="disabled selected">Grant user password</option>
            <option value="telnet@oct2024">Telnet@oct2024</option>
            <option value="telnet@nov2024">Telnet@nov2024</option>
            <option value="telnet@dec2024">Telnet@dec2024</option>
            <option value="telnet@jan2025">Telnet@jan2025</option>
          </select>

          <input
            type="file"
            placeholder="Add image"
            accept="image/*"
            id="profilePicture"
            className="add_input"
            onChange={handleChange}
          />
          

          <button type="submit" className="add_input" disabled={loading}>
                {loading ?(
                  <>
                  <span className="spinner-border spinner-border-sm"></span>
                  </>
                ): "Add user"}
              </button>
      </form>
       </div>
        {errorMessage && (
                  <p className="error-message bg-danger">{errorMessage}</p>
                )}
      </div>
    </div>
  );
}
