import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(""); // To show success message
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate email before sending the request
    if (!email) {
      setErrors({ email: "Email is required" });
      return;
    }

    axios
      .post("http://127.0.0.1:5000/api/users/forgot-password", { email })
      .then((response) => {
        // Assuming the response contains a token for password reset
        setMessage("Password reset link has been sent to your email.");
        navigate(`/reset-password?token=${response.data.token}`); // Redirect to Reset Password page
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          // If the backend returns an error in a specific structure
          const backendError = error.response.data;
          if (backendError.error) {
            setErrors({ general: backendError.error });
          } else if (backendError.message) {
            setErrors({ general: backendError.message });
          } else {
            setErrors({ general: "Something went wrong. Please try again." });
          }
        } else {
          setErrors({ general: "An unexpected error occurred." });
        }
      });
  };

  return (
    <div className="container p-5 mt-4">
      <div className="row justify-content-center mt-4">
        <div className="col-lg-6 col-md-8 col-sm-12">
          <div className="d-flex align-items-center mb-4">
            <i className="fa-solid fa-key fs-1 mx-2 text-primary"></i>
            <h2 className="text-primary">Forgot Password</h2>
          </div>
          <div className="p-4 shadow-lg p-3 mb-5 bg-white rounded-4">

            {/* Email Input */}
            <div className="mb-4">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                className={`form-control ${errors?.email ? "is-invalid" : ""}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
              {errors?.email && (
                <div className="invalid-feedback">{errors.email}</div>
              )}
            </div>

            {/* General Error or Success Messages */}
            {errors?.general && <div className="text-danger mb-3">{errors.general}</div>}
            {message && <div className="text-success mb-3">{message}</div>}

            {/* Submit Button */}
            <div className="d-grid">
              <button
                type="submit"
                className="btn btn-primary py-2 fs-5 fw-bold"
                onClick={handleSubmit}
              >
                Send Reset Link
              </button>
            </div>

            {/* Link to Login page */}
            <div className="mt-3 text-center">
              <p className="text-muted">
                Remember your password? <a href="/login" className="text-decoration-none text-primary">Login here</a>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;



