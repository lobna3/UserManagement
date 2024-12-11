const express = require ('express')
const app = express()
const cors = require('cors')
const port = 5000
const db = require('./database/index.js')
const userRoutes = require ('./routes/user.js')
const  UserProfile= require('./routes/profile.js')
const passport = require('passport')
const cookieParser = require('cookie-parser')
const session = require("express-session");

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors())

app.get('/', (req, res) => {
    res.send("Hello World")
})

app.use(
    session({
      secret: "secret",
      resave: false,
      saveUninitialized: false,
    })
  );
  



/* passport */
app.use(passport.initialize())
require('./security/passport')(passport)

app.use(passport.initialize());
require("./auth/google-auth")(passport);

app.use('/api/users', userRoutes)
app.use('/api/users/profiles', UserProfile)

app.listen(port, () => {
    console.log(`server listening on port ${port}`)
})


