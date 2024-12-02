import React from "react";
import { Link, useNavigate } from "react-router-dom";
import './NavBar.css'; // Import custom CSS for additional styling

const NavBar = ({ user }) => {
  const navigate = useNavigate();

  const logout = () => {
    user.isConnected = false;
    user.role = "USER";
    user.token = null;
    localStorage.removeItem('jwt');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user')
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand fs-4 fw-bold" to="/">
          User Management
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {user.role === "ADMIN" && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin">
                  Admin
                </Link>
              </li>
            )}
          </ul>

          <div className="d-flex">
            <div className="mx-3">
              {!user.isConnected ? (
                <>
                  <Link className="btn btn-outline-primary me-2 px-4 py-2" to="/login">
                    Login
                  </Link>
                  <Link className="btn btn-outline-primary px-4 py-2" to="/register">
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <div className="dropdown">
                    <button
                      className="btn btn-outline-primary dropdown-toggle profile-btn"
                      type="button"
                      id="profileDropdown"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Profile
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="profileDropdown">
                      <li>
                        <Link className="dropdown-item" to="/profile">
                          View Profile
                        </Link>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <button
                          className="dropdown-item text-danger"
                          onClick={logout}
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

