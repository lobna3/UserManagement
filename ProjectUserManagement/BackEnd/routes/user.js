
const express = require('express')

const router = express.Router()

const { getAll, add, getUser, deleteUser, update, Register, Login, VerifyEmail, ForgotPassword, ResetPassword, Logout } = require('../controller/user.js')
const { Test, Admin } = require('../controller/test.js')

const passport = require('passport')
const { ROLES, inRole } = require('../security/Rolemiddleware')



router.post('/register', Register)
router.post('/login', Login)
router.get('/getAll', getAll)
router.post('/add', add)
router.get('/:id', getUser)
router.delete('/:id', deleteUser)
router.put('/:id', update)
router.get('/verify-email', VerifyEmail);
router.post('/logout', Logout);
router.post('/forgot-password', ForgotPassword);
router.post('/reset-password', ResetPassword);

// routes test
router.get('/', passport.authenticate('jwt', { session: false }), Test)
router.get('/test/admin', passport.authenticate('jwt', { session: false }), inRole(ROLES.ADMIN), Admin)

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login",
  }),
  function (req, res) {
     // Successful authentication, redirect home with user data in URL
     console.log('Successful authentication',req.user);
     const { email, name, secret,role } = req.user;  // User data returned from passport
     console.log("email:",email,"name:",name,"secret:",secret,"role",role)
     return res.redirect(
       `http://localhost:5173/login?email=${email}&name=${name}&secret=${secret}&role=${role}`
     );
  }
);

module.exports = router