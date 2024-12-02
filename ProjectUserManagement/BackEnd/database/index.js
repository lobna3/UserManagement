const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1/ProjectUserManagment').then(() => {
    console.log("data base connect successfully")
}).catch((error) => {
    console.log(error)
})

const db = mongoose.connection

module.exports = {
    db
  }

  