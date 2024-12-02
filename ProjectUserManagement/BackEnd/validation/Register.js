const isEmpty = require("./isEmpty") //importée pour vérifier si une valeur est vide.
const validator = require("validator") // Une bibliothèque utilisée pour effectuer des validations sur les chaînes de caractères, comme vérifier si une adresse email est au bon format.

module.exports = function ValidateRegister(data) {
    let errors = {}
  
    data.name = !isEmpty(data.name) ? data.name : ""
    data.email = !isEmpty(data.email) ? data.email : ""
    data.password = !isEmpty(data.password) ? data.password : ""
    data.confirm = !isEmpty(data.confirm) ? data.confirm : ""
  
    if (validator.isEmpty(data.name)) {
      errors.name = "Required name"
    }
    if (!validator.isEmail(data.email)) {
      errors.email = "Required format email"
    }
    if (validator.isEmpty(data.email)) {
      errors.email = "Required email"
    }
    if (validator.isEmpty(data.password)) {
      errors.password = "Required password"
    }
    if(!validator.equals(data.password, data.confirm)){
      errors.confirm = "Passwords not matches"
    }
    //Compare le mot de passe et la confirmation pour s'assurer qu'ils correspondent avec validator.equals().
    if (validator.isEmpty(data.confirm)) {
      errors.confirm = "Required confirm"
    }
    
  
  
    return {
        errors,
        isValid: isEmpty(errors)
    }
  };