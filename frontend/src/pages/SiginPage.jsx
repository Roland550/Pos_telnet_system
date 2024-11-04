import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { loginStart, loginSuccess, loginFailed } from "../redux/user/userSlice";
import page from "../assets/space.gif";
import "./root.css";

export default function SiginPage() {
  const [formData, setFormData] = useState({});

  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.id]: event.target.value.trim(),
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(loginFailed("All fields are required"));
    }
    try {
      dispatch(loginStart());
      const response = await fetch("http://localhost:8000/api/user/signin", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success == false) {
        return dispatch(loginFailed(data.message));
      }

      if (response.ok) {
        dispatch(loginSuccess(data));
        navigate("/card");
      }
    } catch (error) {
      dispatch(loginFailed(error.message));
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

                  <button
                    type="submit"
                    className="page_button"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm"></span>
                      </>
                    ) : (
                      "Sign Up"
                    )}
                  </button>
                 
                  <button type="submit" className="page_button">
                    Continue with Google{" "}
                  </button>
                 
                  <Link to="/signup" className="link_to">Sign Up</Link>
                  {errorMessage && (
                    <p className="error-message bg-danger">{errorMessage}</p>
                  )}
                
              </form>
            </div>
          
        </div>
      
    </>
  );
}
