const multer = require('multer')
const storage =  new multer.memoryStorage()  // store image in memory
const upload = multer({storage:storage})



module.exports = upload