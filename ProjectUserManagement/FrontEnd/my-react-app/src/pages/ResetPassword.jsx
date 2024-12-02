import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);  // State to control modal visibility
  const location = useLocation();
  const navigate = useNavigate();

  const token = new URLSearchParams(location.search).get("token"); // Get the token from the query string

  useEffect(() => {
    if (!token) {
      setErrors({ general: "Invalid or missing token" });
    }
  }, [token]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate password inputs
    if (!newPassword || !confirmPassword) {
      setErrors({ general: "Both password fields are required." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrors({ general: "Passwords do not match." });
      return;
    }

    axios
      .post("http://127.0.0.1:5000/api/users/reset-password", { token, newPassword })
      .then((response) => {
        console.log(response.data);
        setMessage("Your password has been reset successfully.");
        setShowModal(true);  // Show the success modal
        setTimeout(() => navigate("/login"), 3000); // Redirect to login after 3 seconds
      })
      .catch((error) => {
        setErrors(error.response?.data || { general: "Something went wrong" });
      });
  };

  return (
    <div className="container p-5 mt-4">
      <div className="row justify-content-center mt-4">
        <div className="col-lg-6 col-md-8 col-sm-12">
          <div className="d-flex align-items-center mb-4">
            <i className="fa-solid fa-lock fs-1 text-primary"></i>
            <h2 className="text-primary">Reset Your Password</h2>
          </div>
          <div className="p-4 shadow-lg p-3 mb-5 bg-white rounded-4">

            {/* New Password Input */}
            <div className="mb-4">
              <label className="form-label" htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                className={`form-control ${errors?.newPassword ? "is-invalid" : ""}`}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
              />
              {errors?.newPassword && <div className="invalid-feedback">{errors.newPassword}</div>}
            </div>

            {/* Confirm Password Input */}
            <div className="mb-4">
              <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                className={`form-control ${errors?.confirmPassword ? "is-invalid" : ""}`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
              />
              {errors?.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
            </div>

            {/* Error and Success Messages */}
            {errors?.general && <div className="text-danger mb-3">{errors.general}</div>}
            {message && <div className="text-success mb-3">{message}</div>}

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary w-100 py-2 fs-5 fw-bold"
              onClick={handleSubmit}
            >
              Reset Password
            </button>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div
          className="modal fade show"
          tabIndex="-1"
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.6)' }} // Darker background overlay
          aria-labelledby="successModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 shadow-lg">
              <div className="modal-header border-0">
                <h5 className="modal-title text-success" id="successModalLabel">
                  <i className="fa-solid fa-check-circle"></i> Success!
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => setShowModal(false)}  // Close modal manually
                ></button>
              </div>
              <div className="modal-body">
                <p className="fs-5">Your password has been reset successfully. You will be redirected to the login page shortly.</p>
              </div>
              <div className="modal-footer border-0">
                <button
                  type="button"
                  className="btn btn-success px-4 py-2 fs-5 fw-bold"
                  onClick={() => setShowModal(false)}  // Close modal manually
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;



