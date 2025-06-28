# Hextrip

Bienvenue dans le projet "Hextrip". Ce projet est une agence de voyages en ligne, accessible à tous.

Ce projet a été réalisé grâce à la formation de Hadley Videlier, dans le cadre de sa formation "MERN Fullstack". Malgré tout, il a tout de même été re-codé à la main, par Shadow. Ce projet permet de pouvoir développer de nombreuses compétences dans le monde du Fullstack (MongoDB, Express, React, Node).

Celui-ci a été une très belle découverte pour moi-même : n’ayant jamais touché à du Javascript sans l’IA, j’ai réussi à développer de bonnes pratiques (telles que les fonctions async avec try/catch...). Ce projet me permettra sûrement une bonne expérience.
Malgré certaines vidéos parfois complexes pour les novices, avec du temps et de la patience, ceci est complètement réalisable.

C’est pour cela que je souhaite pleinement remercier le formateur, de ce superbe cours !

---

## Langages utilisés

- **MongoDB (Atlas et Compass)** : Utilisé pour stocker les bases de données, vues dans la formation pour comprendre le modèle NoSQL et la gestion des données côté backend.
- **Express** : Framework backend vu dans la formation pour gérer les routes, middlewares, sécurités et connexion avec MongoDB.
- **React** : Utilisé pour construire toute la partie frontend, avec des composants dynamiques, une navigation fluide (React Router) et des appels API.
- **Node.js** : Base du serveur backend, utilisé dans la formation pour créer le serveur principal et gérer l’environnement côté serveur.

---

## Modules utilisés

Voici les modules utilisés et nécessaires pour le bon fonctionnement du code :

- **bcrypt** : Pour hasher les mots de passe utilisateurs avant de les enregistrer.
- **body-parser** : Pour lire les données des requêtes POST (formulaires, JSON...).
- **dotenv** : Pour gérer les variables d’environnement via un fichier `.env`.
- **express** : Le cœur du serveur backend.
- **express-validator** : Pour valider les champs dans les requêtes (email, mot de passe...).
- **http-status-codes** : Pour renvoyer des codes HTTP clairs (200, 404, 500...).
- **jsonwebtoken** : Pour gérer les tokens JWT à la connexion et sécuriser les routes.
- **mongoose** : Pour connecter et structurer les données entre Node.js et MongoDB.
- **morgan** : Pour afficher les logs des requêtes dans la console.
- **multer** : Pour gérer l’upload d’images (form-data).
- **path** : Pour gérer les chemins d’accès (backend vers frontend).
- **stripe** : Pour intégrer les paiements en ligne dans le projet (achat de voyages).

