const User = require ('../model/user.js')

const JwtStrategy = require("passport-jwt").Strategy
const ExtractJwt = require("passport-jwt").ExtractJwt

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

module.exports = (passport) => {
  passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        const user = await User.findById(jwt_payload.id); // Ensure you match the ID properly
        console.log('user',user)
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (error) {
        return done(error, false);
    }
}));
};

  /**
User : Cela importe le modèle utilisateur qui interagit avec la base de données pour récupérer les utilisateurs.
JwtStrategy : C'est la stratégie JWT de Passport qui permet d'authentifier les utilisateurs
en utilisant des tokens JWT.
ExtractJwt : Cet utilitaire aide à extraire le token JWT de la requête HTTP.
   */
  
/**
2-Options de la stratégie :
jwtFromRequest : Configure la méthode d'extraction du token. 
Ici, le token est extrait des en-têtes de la requête, en tant que Bearer Token (par exemple, 
Authorization: Bearer <token>).
secretOrKey : Indique la clé secrète utilisée pour signer le token JWT.
Elle est généralement stockée dans une variable d'environnement pour des raisons de sécurité.
 */

/**
Cette fonction prend un objet passport en argument et lui ajoute une nouvelle stratégie JWT.
La stratégie prend deux arguments : opts (les options définies plus haut)
et une fonction de rappel qui est appelée lors de la vérification du token.
jwt_payload : Il contient les données décodées du token JWT.
Dans cet exemple, on s'attend à ce qu'il contienne un identifiant utilisateur (id).
done : C'est une fonction de rappel utilisée pour indiquer si l'authentification a réussi ou échoué.
Vérification de l'utilisateur :
User.findOne({ _id: jwt_payload.id }, function (err, user) {...}) :
Cette ligne recherche un utilisateur dans la base de données à l'aide de l'identifiant présent dans le jwt_payload.
 */