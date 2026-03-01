import swaggerJsdoc from 'swagger-jsdoc'

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'UserAPI',
      version: '2.0.0',
      description: 'API REST de gestion d\'utilisateurs avec JWT, rôles et upload d\'avatar',
      contact: {
        name: 'NARIVELOSON Seraphin',
      },
    },
    servers: [{ url: 'http://localhost:3000', description: 'Serveur de développement' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Entrez votre access token JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id:              { type: 'integer', example: 1 },
            email:           { type: 'string',  example: 'user@example.com' },
            firstName:       { type: 'string',  example: 'Jean',   nullable: true },
            lastName:        { type: 'string',  example: 'Dupont', nullable: true },
            role:            { type: 'string',  enum: ['USER', 'MODERATOR', 'ADMIN'] },
            avatar:          { type: 'string',  nullable: true },
            isEmailVerified: { type: 'boolean', example: false },
            createdAt:       { type: 'string',  format: 'date-time' },
            updatedAt:       { type: 'string',  format: 'date-time' },
          },
        },
        AuthTokens: {
          type: 'object',
          properties: {
            accessToken:  { type: 'string', example: 'eyJhbGci...' },
            refreshToken: { type: 'string', example: 'eyJhbGci...' },
            user: { $ref: '#/components/schemas/User' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Message d\'erreur' },
          },
        },
      },
    },
    tags: [
      { name: 'Auth',   description: 'Authentification et gestion des tokens' },
      { name: 'Users',  description: 'Gestion du profil utilisateur' },
      { name: 'Admin',  description: 'Administration (ADMIN/MODERATOR uniquement)' },
    ],
    paths: {
      // ─── AUTH ────────────────────────────────────────────────────────────────
      '/api/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Créer un compte',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email:     { type: 'string', example: 'user@example.com' },
                    password:  { type: 'string', example: 'Password1', description: 'Min 8 car., 1 majuscule, 1 chiffre' },
                    firstName: { type: 'string', example: 'Jean' },
                    lastName:  { type: 'string', example: 'Dupont' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Compte créé avec succès' },
            400: { description: 'Données invalides ou email déjà utilisé', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/api/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Se connecter',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email:    { type: 'string', example: 'user@example.com' },
                    password: { type: 'string', example: 'Password1' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Connexion réussie', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthTokens' } } } },
            401: { description: 'Identifiants invalides' },
          },
        },
      },
      '/api/auth/refresh': {
        post: {
          tags: ['Auth'],
          summary: 'Renouveler l\'access token',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['refreshToken'],
                  properties: { refreshToken: { type: 'string' } },
                },
              },
            },
          },
          responses: {
            200: { description: 'Nouveaux tokens retournés' },
            401: { description: 'Refresh token invalide ou expiré' },
          },
        },
      },
      '/api/auth/logout': {
        post: {
          tags: ['Auth'],
          summary: 'Se déconnecter',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { refreshToken: { type: 'string' } },
                },
              },
            },
          },
          responses: { 200: { description: 'Déconnecté avec succès' } },
        },
      },
      '/api/auth/verify-email': {
        get: {
          tags: ['Auth'],
          summary: 'Vérifier l\'adresse email',
          parameters: [{ name: 'token', in: 'query', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Email vérifié' },
            400: { description: 'Token invalide ou expiré' },
          },
        },
      },
      '/api/auth/forgot-password': {
        post: {
          tags: ['Auth'],
          summary: 'Demander un lien de réinitialisation',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { type: 'object', properties: { email: { type: 'string' } } },
              },
            },
          },
          responses: { 200: { description: 'Email envoyé si le compte existe' } },
        },
      },
      '/api/auth/reset-password': {
        post: {
          tags: ['Auth'],
          summary: 'Réinitialiser le mot de passe',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    token:       { type: 'string' },
                    newPassword: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Mot de passe réinitialisé' },
            400: { description: 'Token invalide ou expiré' },
          },
        },
      },
      // ─── USERS ───────────────────────────────────────────────────────────────
      '/api/users/me': {
        get: {
          tags: ['Users'],
          summary: 'Obtenir son profil',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Profil retourné', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
            401: { description: 'Non authentifié' },
          },
        },
        put: {
          tags: ['Users'],
          summary: 'Modifier son profil (email, prénom, nom)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email:     { type: 'string' },
                    firstName: { type: 'string' },
                    lastName:  { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Profil mis à jour' },
            400: { description: 'Email déjà utilisé' },
          },
        },
        delete: {
          tags: ['Users'],
          summary: 'Supprimer son compte',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { type: 'object', properties: { password: { type: 'string' } } },
              },
            },
          },
          responses: { 200: { description: 'Compte supprimé' } },
        },
      },
      '/api/users/me/password': {
        put: {
          tags: ['Users'],
          summary: 'Changer son mot de passe',
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    currentPassword: { type: 'string' },
                    newPassword:     { type: 'string' },
                  },
                },
              },
            },
          },
          responses: { 200: { description: 'Mot de passe modifié' } },
        },
      },
      '/api/users/me/avatar': {
        post: {
          tags: ['Users'],
          summary: 'Uploader un avatar',
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: { avatar: { type: 'string', format: 'binary' } },
                },
              },
            },
          },
          responses: { 200: { description: 'Avatar mis à jour' } },
        },
      },
      // ─── ADMIN ───────────────────────────────────────────────────────────────
      '/api/users': {
        get: {
          tags: ['Admin'],
          summary: 'Lister tous les utilisateurs',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'page',  in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
          ],
          responses: { 200: { description: 'Liste paginée des utilisateurs' } },
        },
      },
      '/api/users/{id}/role': {
        put: {
          tags: ['Admin'],
          summary: 'Changer le rôle d\'un utilisateur',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { role: { type: 'string', enum: ['USER', 'MODERATOR', 'ADMIN'] } },
                },
              },
            },
          },
          responses: { 200: { description: 'Rôle mis à jour' } },
        },
      },
      '/api/users/{id}': {
        delete: {
          tags: ['Admin'],
          summary: 'Supprimer un utilisateur',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Utilisateur supprimé' } },
        },
      },
    },
  },
  apis: [],
}

export const swaggerSpec = swaggerJsdoc(options)
