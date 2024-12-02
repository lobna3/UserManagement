
const Test = (req, res) => {
    
    res.send("Welcome User")
      
}

const Admin = (req, res) => {
    
    res.send("Welcome Admin")
}


module.exports = {
   
    Test,
    Admin,
    
}