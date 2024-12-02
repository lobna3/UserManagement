var GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require("dotenv").config();

module.exports = (passport) => {
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/api/users/auth/google/callback",
      },
      async function (accessToken, refreshToken, profile, cb) {
        try {
          console.log(profile);
  
          // Recherche d'un utilisateur par son Google ID
          let user = await User.findOne({ googleId: profile.id });
  
          if (user) {
            // Si l'utilisateur existe déjà, mettez à jour ses informations
            user.name = profile.displayName;
            user.email = profile.emails[0].value;
            user.password = bcrypt.hashSync(profile.id, 10); // Utilisation de l'ID Google comme mot de passe (haché)
            user.role = 'USER'; // Rôle par défaut
            user.emailVerified = true; // Vérification automatique via Google
            user.secret = accessToken;
  
            user = await user.save(); // Sauvegarde des informations mises à jour
            return cb(null, user); // Retourne l'utilisateur mis à jour
          } else {
            // Recherche si un utilisateur existe déjà avec cet email
            const existingEmailUser = await User.findOne({ email: profile.emails[0].value });
  
            if (existingEmailUser) {
              // Si l'email existe déjà, vous pouvez soit lier le compte, soit créer un message d'erreur adapté
              console.log("L'email est déjà utilisé, mais nous allons lier le compte");
              existingEmailUser.googleId = profile.id; // Lier le Google ID au compte existant
              existingEmailUser.name = profile.displayName;
              existingEmailUser.password = bcrypt.hashSync(profile.id, 10); // Utilisation de l'ID Google comme mot de passe (haché)
              existingEmailUser.role = 'USER'; // Rôle par défaut
              existingEmailUser.emailVerified = true; // Vérification automatique via Google
              existingEmailUser.secret = accessToken;
  
              const updatedUser = await existingEmailUser.save(); // Mise à jour du compte existant
              return cb(null, updatedUser); // Retourne l'utilisateur mis à jour
            } else {
              // Crée un nouvel utilisateur s'il n'y a pas de doublon
              const newUser = new User({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                password: bcrypt.hashSync(profile.id, 10), // Utilisation de l'ID Google comme mot de passe (haché)
                role: 'USER', // Rôle par défaut
                emailVerified: true, // Vérification automatique via Google
                secret: accessToken,
              });
  
              user = await newUser.save(); // Sauvegarde du nouvel utilisateur
              return cb(null, user); // Retourne le nouvel utilisateur
            }
          }
        } catch (error) {
          console.error("Erreur lors de la connexion avec Google:", error);
          return cb(error, null);
        }
      }
    )
  );
  
  
};
