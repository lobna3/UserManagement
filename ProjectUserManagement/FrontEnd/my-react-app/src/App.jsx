import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';  // Import useNavigate
import axios from 'axios';
import jwt_decode from 'jwt-decode';

import NavBar from './components/NavBar.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Admin from './pages/Admin.jsx';
import Profile from './pages/Profile.jsx';
import PrivateRouter from './components/PrivateRouter.jsx';
import NoAccess from './pages/NoAccess.jsx';
import NotFound from './pages/NotFound.jsx';
import AdminRouter from './components/AdminRouter.jsx';
import ForceRedirect from './components/ForceRedirect.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import Dashboard from './pages/Dashboard.jsx'

import store from './redux/store.js'
import { Logout, setUser } from './redux/actions/authActions';
import { useSelector } from 'react-redux';
import { setAuth } from './utils/setAuth';

 if(window.localStorage.jwt){
   const decode = jwt_decode(window.localStorage.jwt)
   store.dispatch(setUser(decode))
   setAuth(window.localStorage.jwt)
   const currentDate = Date.now / 1000

   if(decode.exp >  currentDate){
    store.dispatch(Logout()) 
   }
 }


function App() {
  const auth = useSelector(state => state.auth)
  const users = {
    isConnected: auth.isConnected,
    role: auth.user.role
  }

  console.log('users',users)
  const [user, setUser] = useState({
    isConnected: false,
    role: 'USER',
    token: null,
    id: '',

  });

  const [errors, setErrors] = useState({});

  // Fonction pour vérifier le statut de l'authentification
  const checkAuthStatus = () => {
    if (window.localStorage.jwt) {
      const decoded = jwt_decode(window.localStorage.jwt);  // Utilisation de jwt_decode
      const currentDate = Date.now() / 1000;  // Obtenez la date actuelle en secondes

      // Vérifiez si le token est expiré
      if (decoded.exp < currentDate) {
        // Si le token est expiré, déconnectez l'utilisateur
        localStorage.removeItem('jwt');
        setUser({
          isConnected: false,
          role: 'USER',
          token: null,
          id: '',
        });
      } else {
        // Si le token est valide, définissez l'utilisateur
        setUser({
          isConnected: true,
          role: decoded.role,
          token: window.localStorage.jwt,
          id: decoded.id,
        });
      }
    }
  };

  // Fonction pour récupérer les données (exemple ici, à remplacer par une requête spécifique)
  const fetchData = () => {
    axios.get('http://127.0.0.1:5000/api/users/getAll')
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };

  // Fonction de connexion (envoie de requête à l'API de login)
  const postLogin = (body, navigate) => {
    axios.post('http://127.0.0.1:5000/api/users/login', body)
      .then((response) => {
        const { accessToken, refreshToken,user} = response.data;
        if (!user.emailVerified) {
          setErrors({ email: 'Please verify your email before logging in.' });
          return;  // Stop further execution to prevent login
        }
        localStorage.setItem('jwt', accessToken);  // Enregistrer le JWT dans localStorage
        localStorage.setItem('refreshToken', refreshToken);

        const decoded = jwt_decode(accessToken);  // Décoder le token
        setUser({
          isConnected: true,
          role: decoded.role,
          token: accessToken,
          id: decoded.id,
         
        });
        
        navigate('/');  // Redirection après la connexion réussie
      })
      .catch((error) => {
        if (error.response) {
          setErrors(error.response.data);
        }
      });
  };

  // Function to handle Google login
  const googleLogin = () => {
    window.location.href = 'http://localhost:5000/api/users/auth/google';  // Redirect to the backend API to handle Google OAuth
  };

 
  // Fonction d'enregistrement d'un utilisateur
  const postRegister = (body, navigate) => {
    axios.post('http://127.0.0.1:5000/api/users/register', body)
      .then((response) => {
        navigate('/login');  // Redirection vers la page de connexion après l'enregistrement
      })
      .catch((error) => {
        setErrors(error.response.data);
      });
  };

  useEffect(() => {
    checkAuthStatus();  // Vérifier le statut de l'utilisateur
    fetchData();  // (exemple) Appeler des données supplémentaires
     
  }, []);
console.log('user',user)
  return (
    <div className="App">
      <BrowserRouter>
        <div className="bg-light" style={{ height: "150vh" }}>
          <NavBar user={user} />
          <Routes>
            {/* Route pour la page d'accueil protégée */}
            <Route path="/" element={<PrivateRouter user={user}><Dashboard user={user} /></PrivateRouter>} />

            {/* Route pour le profil utilisateur, accessible seulement si connecté */}
            <Route path="/profile" element={<PrivateRouter user={user}><Profile user={user} /></PrivateRouter>} />

            {/* Route pour la connexion, avec redirection si déjà connecté */}
            <Route path="/login" element={<ForceRedirect user={user}><Login add={postLogin} errors={errors} googleLogin={googleLogin}   setUser={setUser}/></ForceRedirect>} />

            {/* Route pour l'enregistrement, avec redirection si déjà connecté */}
            <Route path="/register" element={<ForceRedirect user={user}><Register add={postRegister} errors={errors} /></ForceRedirect>} />

            {/* Route pour la page admin avec contrôle d'accès */}
            <Route path="/admin" element={<AdminRouter user={user}><Admin user={user} /></AdminRouter>} />

            {/* Route pour le mot de passe oublié */}
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Route pour la réinitialisation du mot de passe */}
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Route pour gérer les pages 404 */}
            <Route path="*" element={<NotFound />} />

            {/* Route pour la page d'accès interdit */}
            <Route path="/noaccess" element={<NoAccess />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;




