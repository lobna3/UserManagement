const ROLES = {
    "USER": "USER",
    "ADMIN": "ADMIN"
}

const inRole  = (...roles)=>(req, res, next)=>{
    const role =  roles.find(role=> req.user.role === role)
    if(!role){
      return res.status(401).json({message: "no access"})
    }
     next()
}

module.exports = {
    inRole,
    ROLES
}

/**
inRole est une fonction qui prend un ou plusieurs rôles en paramètres (...roles).
Elle retourne un middleware qui est exécuté lors de la gestion des requêtes.
Ce middleware reçoit les objets req, res, et next.
La fonction vérifie si le rôle de l'utilisateur (req.user.role) 
correspond à l'un des rôles autorisés passés en paramètres. 
Si aucun rôle ne correspond, elle renvoie une réponse HTTP 401 (non autorisé) avec un message "no access".
Si le rôle est valide, elle appelle next(), permettant à la requête de continuer vers le prochain middleware ou la route.
 */