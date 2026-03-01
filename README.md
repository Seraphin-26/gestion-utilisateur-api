# 🚀 Gestion Utilisateur API

API REST fullstack de gestion d'utilisateurs, construite avec **Express + TypeScript** côté backend et **React + Vite** côté frontend.

Projet réalisé par **NARIVELOSON Seraphin**.

---

## ✨ Fonctionnalités

### Sécurité
- 🔐 Authentification JWT avec access token (15min) + refresh token (7j)
- 🔄 Renouvellement automatique des tokens
- 🛡️ Rate limiting sur les routes sensibles
- 🪖 Helmet.js pour les headers HTTP
- ✅ Validation des inputs avec Zod
- 🌐 CORS configuré

### Utilisateurs
- 👤 Inscription / Connexion / Déconnexion
- 📧 Vérification de l'email à l'inscription
- 🔑 Réinitialisation du mot de passe par email
- 🖼️ Upload de photo de profil
- ✏️ Modification du profil (nom, prénom, email)
- 🗑️ Suppression de compte

### Rôles et permissions
- 👤 USER — accès à son propre profil
- 🛡️ MODERATOR — peut voir la liste des utilisateurs
- 👑 ADMIN — gestion complète (rôles, suppression)

### Frontend
- ⚡ React + Vite + TypeScript
- 🎨 Tailwind CSS avec mode sombre/clair
- 🌍 Internationalisation FR/EN
- 🎬 Animations Framer Motion
- 💀 Skeleton loaders
- 📱 Responsive mobile

### Qualité
- 🧪 54 tests (Jest + Supertest)
- 📚 Documentation Swagger sur `/api/docs`
- 📋 Logs structurés Winston

---

## 🛠️ Stack technique

| Couche | Technologies |
|---|---|
| Backend | Node.js, Express, TypeScript |
| Base de données | PostgreSQL + Prisma ORM |
| Authentification | JWT, bcrypt |
| Validation | Zod |
| Email | Nodemailer |
| Upload | Multer + Sharp |
| Frontend | React, Vite, TypeScript |
| UI | Tailwind CSS, Framer Motion |
| State | Zustand, TanStack Query |
| Tests | Jest, Supertest |
| Docker | PostgreSQL en container |

---

## 🚀 Installation

### Prérequis
- Node.js 18+
- Docker

### Backend
```bash
cd user-api
cp .env.example .env    # remplir les variables
npm install
docker compose up -d db
npx prisma migrate dev
npm run dev
```

### Frontend
```bash
cd user-frontend
npm install
npm run dev
```

### Tests
```bash
cd user-api
npm test                  # tous les tests
npm run test:coverage     # avec rapport de couverture
```

---

## 📚 Documentation API

Une fois le serveur lancé, ouvre :
```
http://localhost:3000/api/docs
```

---

## 📁 Structure du projet
```
gestion-utilisateur-api/
├── user-api/                 # Backend Express
│   ├── src/
│   │   ├── config/           # env, multer, swagger
│   │   ├── controllers/      # logique des routes
│   │   ├── middleware/        # auth, validation, rate limit
│   │   ├── routes/           # définition des routes
│   │   ├── services/         # logique métier
│   │   ├── utils/            # jwt, email, logger
│   │   ├── validators/       # schémas Zod
│   │   └── __tests__/        # tests Jest
│   └── prisma/               # schéma BDD
└── user-frontend/            # Frontend React
    └── src/
        ├── components/       # composants UI
        ├── hooks/            # hooks React Query
        ├── pages/            # pages de l'app
        ├── services/         # appels API
        ├── store/            # état global Zustand
        └── i18n/             # traductions FR/EN
```

---

## 🌐 Routes API

| Méthode | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | ❌ | Inscription |
| POST | `/api/auth/login` | ❌ | Connexion |
| POST | `/api/auth/refresh` | ❌ | Renouveler le token |
| POST | `/api/auth/logout` | ❌ | Déconnexion |
| GET | `/api/auth/verify-email` | ❌ | Vérifier l'email |
| POST | `/api/auth/forgot-password` | ❌ | Mot de passe oublié |
| POST | `/api/auth/reset-password` | ❌ | Réinitialiser le mot de passe |
| GET | `/api/users/me` | ✅ | Mon profil |
| PUT | `/api/users/me` | ✅ | Modifier mon profil |
| PUT | `/api/users/me/password` | ✅ | Changer mon mot de passe |
| POST | `/api/users/me/avatar` | ✅ | Uploader mon avatar |
| DELETE | `/api/users/me` | ✅ | Supprimer mon compte |
| GET | `/api/users` | 👑 ADMIN | Lister les utilisateurs |
| PUT | `/api/users/:id/role` | 👑 ADMIN | Changer un rôle |
| DELETE | `/api/users/:id` | 👑 ADMIN | Supprimer un utilisateur |
