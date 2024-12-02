import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";

const Login = ({ add, errors, googleLogin, setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const navigate = useNavigate();
  let [searchParams] = useSearchParams();

  // Extraire les paramètres de l'URL
  const emailFromSearch = searchParams.get("email");
  const nameFromSearch = searchParams.get("name");
  const secretFromSearch = searchParams.get("secret");
  const role = searchParams.get("role");
  // Stocker les données utilisateur dans localStorage si les paramètres URL sont disponibles
  useEffect(() => {
    if (emailFromSearch && nameFromSearch && secretFromSearch &&role) {
      const userData = {
        email: emailFromSearch,
        name: nameFromSearch,
        secret: secretFromSearch,
        role:role
      };
      localStorage.setItem("user", JSON.stringify(userData));
    }
  }, [emailFromSearch, nameFromSearch, secretFromSearch,role]);

  // Récupérer les données utilisateur depuis localStorage lors du montage du composant
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      // Mettre à jour l'état global (via la fonction setUser passée par le parent)
      setUser({
        isConnected: true,
        role: role,
        ...storedUser, // Inclure les données stockées
      });
    }
  }, [setUser]);

  // Gérer la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    add({ email, password }, navigate); // Appeler la fonction `add` pour la logique de connexion
  };

  return (
    <div className="container p-5 mt-4">
      <div className="row justify-content-center mt-4">
        <div className="col-lg-6 col-md-8 col-sm-12">
          <div className="d-flex">
            <i className="fa-solid fa-right-to-bracket fs-1 mx-2"></i>
            <h2>Login</h2>
          </div>
          <div className="p-4 shadow-lg p-3 mb-5 bg-white rounded">
            {/* Email input */}
            <div className="mb-3">
              <label className="form-label">Email address</label>
              <div className="input-group">
                <span className="input-group-text" id="basic-addon1">
                  <i className="fa-solid fa-at"></i>
                </span>
                <input
                  type="email"
                  className={`form-control ${errors?.email ? "is-invalid" : ""}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
                {errors?.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>
            </div>

            {/* Password input */}
            <div className="mb-3">
              <label className="form-label">Password</label>
              <div className="input-group">
                <span className="input-group-text" id="basic-addon1">
                  <i className="fa-solid fa-key"></i>
                </span>
                <input
                  type="password"
                  className={`form-control ${errors?.password ? "is-invalid" : ""}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
                {errors?.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="d-flex justify-content-between">
              <button
                type="submit"
                className="btn btn-primary w-100"
                onClick={handleSubmit}
              >
                Login <i className="fa-solid fa-right-to-bracket"></i>
              </button>
            </div>

            {/* Google login button */}
            <div className="mt-3 text-center">
              <button className="btn btn-danger w-100" onClick={googleLogin}>
                Login with Google <i className="fa-brands fa-google"></i>
              </button>
            </div>

            {/* Register and Forgot Password Links */}
            <div className="mt-3 text-center">
              <p className="text-muted">
                Don't have an account?{" "}
                <Link to="/register" className="text-decoration-none text-primary">
                  Register
                </Link>
              </p>
              <p className="text-muted">
                Forgot Password?{" "}
                <Link to="/forgot-password" className="text-decoration-none text-primary">
                  Reset here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;







