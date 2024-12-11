
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Classnames from 'classnames';
import axios from 'axios';

const Register = () => {
  // State for form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  // State for verification and error messages
  const [verificationMessage, setVerificationMessage] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const [alertMessage, setAlertMessage] = useState(""); // State for alert messages
  const [alertType, setAlertType] = useState(""); // Success or error message type
  const [errors, setErrors] = useState({}); // Store field errors
  const [showModal, setShowModal] = useState(false); // Modal visibility

  // State for preventing registration after sending verification email
  const [isEmailSent, setIsEmailSent] = useState(false); // Prevent registration if email verification sent

  const navigate = useNavigate();
  const location = useLocation();

  // Extract token from URL for email verification
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  useEffect(() => {
    if (token) {
      verifyEmail(token);
      console.log('token',token)
    }
  }, [token]);

  // Verify email by sending the token to the backend
  const verifyEmail = async (token) => {
    setIsVerifying(true); // Set loading state
    try {
      // Call the backend to verify the email token
      const response = await axios.post(`http://127.0.0.1:5000/api/users/verify-email?token=${token}`);

      // If verification is successful, show success message
      setVerificationMessage(response.data.message);
      setAlertMessage(response.data.message); // Show success message in the modal
      setAlertType("success");
      setShowModal(true); // Show success modal after verification

      // Optionally navigate to another page after verification
     setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (error) {
      // Handle error if verification fails
      setVerificationMessage(error.response?.data?.error || 'Verification failed.');
      setAlertMessage(error.response?.data?.error || 'Verification failed.');
      setAlertType("error");
      setShowModal(true);
    } finally {
      setIsVerifying(false); // Reset loading state
    }
  };


  // Function to handle registration
  const postRegister = (body, navigate) => {
    axios.post('http://127.0.0.1:5000/api/users/register', body)
      .then((response) => {
        console.log(response.data);
        if (response.data.message && response.data.message.includes("User created successfully. Please verify your email to complete the registration.")) {
          setAlertMessage(response.data.message); // Success message
          setAlertType("success");
          setShowModal(true);

          // Reset the email sent flag to prevent further attempts at registration
          setIsEmailSent(false); // Reset flag after registration
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        }
        // If a new verification email has been sent, show a warning and prevent further registration
        if (response.data.message && response.data.message.includes("A new verification email has been sent. Please check your inbox.")) {
          setAlertMessage(response.data.message);
          setAlertType("warning");
          setIsEmailSent(true); // Set flag to prevent further registration
          setShowModal(true); // Show modal with message
        }

        // If the user was created successfully, show success alert
        // Redirect to login page after 2 seconds to give time for the modal to show

      })
      .catch((error) => {
        console.error(error.response.data);
        setErrors(error.response.data);  // Set errors to display them on the form
        setAlertMessage("Registration failed. Please try again.");
        setAlertType("error");
        setShowModal(true);  // Show error modal on failure
      });
  };

  // Handle registration form submission
  const handleRegister = async (e) => {
    e.preventDefault();

    // Prevent registration if an email verification has already been sent
    if (isEmailSent) {
      setAlertMessage("Please verify your email before registering again.");
      setAlertType("warning");
      setShowModal(true);
      return; // Prevent form submission
    }

    // Password validation
    if (password !== confirm) {
      setAlertMessage("Passwords don't match!");
      setAlertType("error");
      setShowModal(true); // Show error modal
      return;
    }

    // Prepare the request body
    const body = {
      name: name,
      email: email,
      password: password,
      confirm: confirm,
    };

    // Call the postRegister function to submit the form
    postRegister(body, navigate);
  };

  return (
    <div className="container p-5 mt-4">
      <div className="row justify-content-center mt-4">
        <div className="col-lg-6 col-md-8 col-sm-12">
          <div className="d-flex">
            <i className="fa-solid fa-right-to-bracket fs-1 mx-2"></i> <h2>Register</h2>
          </div>
          <div className="p-4 shadow-lg p-3 mb-5 bg-white rounded">

            {/* Display alert message if any */}
            {alertMessage && (
              <div className={`alert ${alertType === 'success' ? 'alert-success' : 'alert-danger'}`} role="alert">
                {alertMessage}
              </div>
            )}

            {/* Registration Form */}
            {!token ? (  // Only show registration form if no token is in URL
              <form onSubmit={handleRegister}>
                {/* Name Input */}
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <div className="input-group">
                    <span className="input-group-text" id="basic-addon1"><i className="fa-solid fa-user"></i></span>
                    <input
                      type="text"
                      className={Classnames("form-control", { "is-invalid": errors?.name })}
                      value={name}
                      onChange={(e) => { setName(e.target.value) }}
                      placeholder="Enter your name"
                    />
                    {errors?.name && (
                      <div className="invalid-feedback">
                        {errors.name}
                      </div>
                    )}
                  </div>
                </div>

                {/* Email Input */}
                <div className="mb-3">
                  <label className="form-label">Email address</label>
                  <div className="input-group">
                    <span className="input-group-text" id="basic-addon1"><i className="fa-solid fa-at"></i></span>
                    <input
                      type="email"
                      className={Classnames("form-control", { "is-invalid": errors?.email })}
                      value={email}
                      onChange={(e) => { setEmail(e.target.value) }}
                      placeholder="Enter your email"
                    />
                    {errors?.email && (
                      <div className="invalid-feedback">
                        {errors.email}
                      </div>
                    )}
                  </div>
                </div>

                {/* Password Input */}
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <div className="input-group">
                    <span className="input-group-text" id="basic-addon1"><i className="fa-solid fa-key"></i></span>
                    <input
                      type="password"
                      className={Classnames("form-control", { "is-invalid": errors?.password })}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value) }}
                      placeholder="Enter your password"
                    />
                    {errors?.password && (
                      <div className="invalid-feedback">
                        {errors.password}
                      </div>
                    )}
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div className="mb-3">
                  <label className="form-label">Confirm Password</label>
                  <div className="input-group">
                    <span className="input-group-text" id="basic-addon1"><i className="fa-solid fa-key"></i></span>
                    <input
                      type="password"
                      className={Classnames("form-control", { "is-invalid": errors?.confirm })}
                      value={confirm}
                      onChange={(e) => { setConfirm(e.target.value) }}
                      placeholder="Confirm your password"
                    />
                    {errors?.confirm && (
                      <div className="invalid-feedback">
                        {errors.confirm}
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="d-flex justify-content-between align-items-center">
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                  >
                    Save <i className="fa-solid fa-floppy-disk"></i>
                  </button>
                </div>

                <div className="mt-3 text-center">
                  <p>Already have an account? <Link to="/login" className="text-decoration-none">Login</Link></p>
                </div>
              </form>
            ) : (
              // Verification Status Message
              <div className="text-center">
                {isVerifying ? (
                  <div>Verifying your email...</div>
                ) : (
                  <div>{verificationMessage || 'Your email has been verified successfully!'}</div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Success Modal (only for success alertType) */}
      {alertType === 'success' && showModal && (
        <div className={`modal fade show`} tabIndex="-1" aria-hidden={!showModal} style={{ display: showModal ? 'block' : 'none' }}>
          <div className="modal-dialog">
            <div className="modal-content" style={{ backgroundColor: '#fff', borderRadius: '8px' }}>
              {/* Modal Header */}
              <div className="modal-header border-bottom-0">
                <h5 className="modal-title text-success">Registration Status</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              {/* Modal Body */}
              <div className="modal-body text-center">
                <p className={alertType === "success" ? "text-success" : "text-warning"}>{alertMessage}</p>
              </div>
              {/* Modal Footer */}
              <div className="modal-footer border-top-0">
                <button type="button" className="btn btn-success w-100" onClick={() => setShowModal(false)}>
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

export default Register;




