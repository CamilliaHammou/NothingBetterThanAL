# NothingBetterThanAL

This project involves creating a RESTful API in Node.js and TypeScript with several key features centered around cinema management.

# Credits
Group 6 3AL1:
- Camillia HAMMOU
- Denisa DUDAS

# Getting started

## Installation
1. Install NPM packages :
```sh
npm install
```
2. Start the database :
```sh
docker compose up --build
```
3. Run the app :
```sh
npm run start:dev
```
## Usage
1. Connect to the database `http://localhost:8080`, with:
```sh
username: root
password: abc123
```
2. Import the `NothingBetterThanAL_groupe6.sql` file.
3. Import the `NothingBetterThanAL_groupe6.postman_collection.json` into Postman to test our endpoints.
4. API documentation accessible here: `http://localhost:3000/api-docs`

# Project checklist
- [x] Hall Management
- [x] Session Management
- [x] Movie Management
- [x] User Management with Bonus
- [x] Bonus : Employee Schedule Management
- [x] Ticket Management
- [x] Transaction Management
- [x] Statistics and Attendance

- We also made migrations : `npm run migration:run`


Super Administrateur :

Scénario 1: Création d'un nouvel user.
Effectue une requête POST à /users/signup pour créer un nouvel user.
Scénario 2: Ajout d'un nouvel employé.
Effectue une requête POST à /users/create-employee pour créer un nouvel employé.
Scénario 3: Consultation de tous les utilisateurs.
Effectue une requête GET à /users pour obtenir la liste de tous les utilisateurs.
Scénario 4: Planification des employés.
Effectue des requêtes CRUD à /employee-schedule pour planifier les employés dans chaque poste.


Administrateur :

Scénario 1: Ajout d'une nouvelle salle de cinéma.
Effectue une requête POST à /halls pour ajouter une nouvelle salle.
Scénario 2: Planification d'une séance.
Effectue une requête POST à /sessions pour planifier une nouvelle séance.
Scénario 3: Consultation des statistiques de fréquentation.
Effectue une requête GET à /attendance/overview pour consulter les statistiques de fréquentation.


Client :
Scénario 1: Achat d'un billet.
Effectue une requête POST à /tickets/buy pour acheter un billet pour une séance.
Scénario 2: Consultation de ses propres billets.
Effectue une requête GET à /tickets pour obtenir la liste de ses billets.


Réceptionniste :

Scénario 1: Vente de billets.
Effectue une requête POST à /tickets/buy pour vendre des billets à un client.
Scénario 2: Consultation du planning des séances.
Effectue une requête GET à /sessions pour consulter le planning des séances.


Projectionniste :

Scénario 1: Validation de l'accès à une séance.
Effectue une requête POST à /attendances/attend pour valider l'accès à une séance.