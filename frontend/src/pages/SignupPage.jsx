import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import page from "../assets/space.gif";
import "./root.css";

export default function SignupPage() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.id]: event.target.value.trim(),
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage("All fields are required");
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch("http://localhost:8000/api/user/signup", {
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
        navigate("/signin");
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };
  return (
    <>
     
      <div className="sign_container ">
        {/* Welcome page */}
        <div className="text_page">
            <h1 className="">
              Welcome to <span className="lgo1">TELNET POS</span>
            </h1>
            <p className="">
              Create your profile and start selling
            </p>
            <img src={page} alt="" className="w-50 h-50" />
          </div>
        {/* Form */}
       
          <div className="form-page">
            <form onSubmit={handleSubmit}>
             
                <input
                  type="text"
                  className="page_input"
                  id="username"
                  placeholder="Username"
                  onChange={handleChange}
                />
                <input
                  type="email"
                  className="page_input"
                  id="email"
                  placeholder="Email"
                  onChange={handleChange}
                />

                <input
                  type="password"
                  className="page_input"  
                  id="password"
                  placeholder="Password"
                  onChange={handleChange}
                />

                <button type="submit" className="page_button" disabled={loading}>
                  {loading ?(
                    <>
                    <span className="spinner-border spinner-border-sm"></span>
                    </>
                  ): "Sign Up"}
                </button>
                <button type="submit" className="page_button">
                  Continue with Google{" "}
                </button>
                <Link to="/signin" className="link_to">Sign In</Link>
                {errorMessage && (
                  <p className="error-message bg-danger">{errorMessage}</p>
                )}
             
            </form>
          </div>
        </div>
      
    
    </>
  );
}
