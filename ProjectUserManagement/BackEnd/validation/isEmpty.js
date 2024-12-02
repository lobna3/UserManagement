const isEmpty = value =>
    value === null || // Vérifie si la valeur est null
    value === undefined || // Vérifie si la valeur est undefined
    (typeof (value) === "object" && Object.keys(value).length === 0) || // Vérifie si c'est un objet vide
    (typeof (value) === "string" && value.trim().length === 0) // Vérifie si c'est une chaîne de caractères vide ou composée uniquement d'espaces

module.exports = isEmpty


/**
La fonction isEmpty est utilisée pour vérifier si une valeur est considérée comme "vide". 
Voici une explication détaillée de son fonctionnement :
Explication de la Fonction isEmpty
javascript
Détails des Vérifications
value === null : Cette condition vérifie si la valeur est explicitement null, ce qui indique l'absence d'objet.

value === undefined : Cette condition vérifie si la valeur n’a pas été définie.
En JavaScript, une variable qui n'a pas été initialisée a la valeur undefined.

typeof(value) === "object" && Object.keys(value).length === 0 :

Ici, on vérifie d'abord si la valeur est un objet.
Ensuite, Object.keys(value).length === 0 vérifie si cet objet n'a aucune propriété. 
Cela signifie que l'objet est vide.

typeof(value) === "string" && value.trim().length === 0 :
Cette condition vérifie si la valeur est une chaîne de caractères.
value.trim().length === 0 vérifie si la chaîne est vide ou ne contient que des espaces,
en utilisant trim() pour retirer les espaces en début et en fin.
 */