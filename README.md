# AI Job Matcher

## Description Générale

Le projet **AI Job Matcher** est une plateforme intelligente de mise en relation entre chercheurs d’emploi et offres de travail, basée sur l’intelligence artificielle. L’objectif principal est de simplifier le processus de recrutement en automatisant l’analyse des CV et des descriptions de postes, afin de proposer des correspondances pertinentes entre les candidats et les emplois disponibles.

## Structure du Projet

Ce projet est divisé en trois composants principaux :

*   **`backend/`** : Contient le code du serveur Spring Boot, gérant l'authentification, la gestion des utilisateurs, des CV, des offres d'emploi et des résultats de matching.
*   **`frontend/`** : Contient le code de l'application web React, offrant une interface utilisateur pour les candidats et les recruteurs.
*   **`ai-nlp/`** : Contient le module d'intelligence artificielle et de traitement du langage naturel (NLP) pour l'extraction des compétences et l'algorithme de matching.

## Technologies Utilisées

### Backend

*   Spring Boot
*   Spring Security
*   Hibernate
*   MySQL
*   REST API

### Frontend

*   React
*   Vite
*   Tailwind CSS

### AI / Data Processing

*   spaCy
*   scikit-learn
*   Techniques NLP (TF-IDF, similarité cosinus, prétraitement de texte, extraction de mots-clés)
