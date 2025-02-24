import { Link } from "react-router-dom";
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";
import { FaMoon, FaSun } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import del from "../assets/logout.png";
import logo from "../assets/teln.png";
import "./navbar.css";
import { logout } from "../redux/user/userSlice";
import { toast } from "react-toastify";
// import bell from '../assets/bell.png'

export default function Navbar() {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const dispatch = useDispatch();

  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);

  const toastOptions = {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  };

  useEffect(() => {
    if (theme === "light") {
      document.body.classList.remove("dark");
    } else {
      document.body.classList.add("dark");
    }
  }, [theme]);

  //handle logout user
  const handleSignOut = async () => {
    try {
      const res = await fetch(
        "https://pos-backend-bs8i.onrender.com/api/user/signout",
        {
          method: "POST",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(logout(data));
        toast.success("Signed out successfully", toastOptions);
        setShowModal(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const Menu = () => (
    <div className="menuBox">
      <img
        src={currentUser?.profilePicture}
        className="avatar w-10 h-10 rounded-5 object-cover sm:w-5 sm:h-5 mt-4"
      />
      <h4 className="username text-gray">{currentUser?.email}</h4>

      {currentUser.isAdmin ? (
        <>
          <span className="text-light fw-bold bg-dark p-1 rounded position-absolute top-0 end-0 m-2">
            Admin💎
          </span>
          <p className="border-link">
            <Link to="/addproduct" className="link">
              {" "}
              Add product
            </Link>
          </p>
          <p className="border-link">
            <Link to="/productList" className="link">
              {" "}
              Product list
            </Link>
          </p>
          <p className="border-link">
            <Link to="/users" className="link">
              {" "}
              Users
            </Link>
          </p>
          <p className="border-link">
            <Link to="/adduser" className="link">
              Add User
            </Link>
          </p>
          <p className="border-link">
            <Link to="/sold-items-report" className="link">Sold Items Report</Link>
          </p>
          <p className="border-link">
            <Link to="/complains" className="link">
              Complains
            </Link>
          </p>
        </>
      ) : (
        <span className="text-light fw-bold bg-dark p-1 rounded position-absolute top-0 end-0 m-2">
          User🌻
        </span>
      )}

      <p className="border-link">
        <Link to="/card" className="link">
          {" "}
          Store
        </Link>
      </p>

      <p className="border-link">
        <Link to="/message" className="link">
          Send Message
        </Link>
      </p>
      <div className="gpt4_navbar-menu_container-links-sign">
        <button
          type="button"
          onClick={() => {
            setToggleMenu(false);
            setShowModal(true);
          }}
          className="btn_ooo"
        >
          Sign out
        </button>
      </div>
    </div>
  );

  useEffect(() => {
    console.log("currentUser changed:", currentUser);
  }, [currentUser]);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup when component is unmounted or showModal changes
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);

  return (
    <>
      <header className="sticky-header">
        <nav className="navbar">
          <div className="logo">
            <img src={logo} alt="logo" />
            <div className="title"></div>
          </div>

          <p className="hello">
            It is your day <span>{currentUser?.username}</span>{" "}
          </p>

          <div className="navbar-item">
            {currentUser ? (
              <div className="hidden">
                <button
                  className="theme-btn  "
                  color="gray"
                  onClick={() => dispatch(toggleTheme())}
                >
                  {theme == "light" ? (
                    <FaSun size={25} />
                  ) : (
                    <FaMoon size={25} />
                  )}
                </button>
              </div>
            ) : (
              <div className="gpt4_navbar-menu_container-links-sign">
                <button type="button">Sign in</button>
              </div>
            )}
          </div>
          {currentUser ? (
            <div className="gpt4_navbar-menu">
              {toggleMenu ? (
                <RiCloseLine
                  color="#000"
                  size={27}
                  onClick={() => setToggleMenu(false)}
                />
              ) : (
                <RiMenu3Line
                  color="#000"
                  size={27}
                  onClick={() => setToggleMenu(true)}
                />
              )}
              {toggleMenu && (
                <div className="gpt4_navbar-menu_container scale-up-center bg-light dark:bg-dark">
                  <div className="gpt4_navbar-menu_container-links  bg-light dark:bg-dark">
                    {currentUser ? (
                      <Menu />
                    ) : (
                      <div className="gpt4_navbar-menu_container-links-sign">
                        <button type="button">Sign in</button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            ""
          )}
        </nav>
      </header>
      {showModal && (
        <div className="modal-container" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={del} alt="" />
            <h4>Sign out</h4>
            <p>Are you sure you want to sign out?</p>

            <div className="modal-buttons">
              <button onClick={handleSignOut}>Yes, I am sure</button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setToggleMenu(true);
                }}
              >
                No, I am not
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
