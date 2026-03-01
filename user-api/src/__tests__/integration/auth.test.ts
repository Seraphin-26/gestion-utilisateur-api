import request from 'supertest'
import app from './app'
import prisma from '../../models/prisma'

// ─── Nettoyage BDD avant/après ────────────────────────────────────────────────
beforeAll(async () => {
  // Supprimer les utilisateurs de test
  await prisma.user.deleteMany({ where: { email: { contains: '@test-jest.com' } } })
})

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: { contains: '@test-jest.com' } } })
  await prisma.$disconnect()
})

// ─── REGISTER ─────────────────────────────────────────────────────────────────
describe('POST /api/auth/register', () => {

  it('201 — crée un utilisateur avec des données valides', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'register@test-jest.com', password: 'Password1' })

    expect(res.status).toBe(201)
    expect(res.body.user.email).toBe('register@test-jest.com')
    expect(res.body.user).not.toHaveProperty('password') // ne jamais exposer le mot de passe
  })

  it('201 — accepte firstName et lastName optionnels', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'named@test-jest.com', password: 'Password1', firstName: 'Jean', lastName: 'Dupont' })

    expect(res.status).toBe(201)
    expect(res.body.user.email).toBe('named@test-jest.com')
  })

  it('400 — rejette un email déjà utilisé', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'register@test-jest.com', password: 'Password1' })

    expect(res.status).toBe(400)
    expect(res.body.message).toMatch(/déjà utilisé/i)
  })

  it('400 — rejette un email invalide', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'pas-un-email', password: 'Password1' })

    expect(res.status).toBe(400)
  })

  it('400 — rejette un mot de passe sans majuscule', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'nouveau@test-jest.com', password: 'password1' })

    expect(res.status).toBe(400)
  })

  it('400 — rejette un mot de passe sans chiffre', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'nouveau@test-jest.com', password: 'Password' })

    expect(res.status).toBe(400)
  })

})

// ─── LOGIN ─────────────────────────────────────────────────────────────────────
describe('POST /api/auth/login', () => {

  beforeAll(async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ email: 'login@test-jest.com', password: 'Password1' })
  })

  it('200 — retourne accessToken et refreshToken', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@test-jest.com', password: 'Password1' })

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('accessToken')
    expect(res.body).toHaveProperty('refreshToken')
    expect(res.body.user.email).toBe('login@test-jest.com')
  })

  it('401 — rejette un mauvais mot de passe', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@test-jest.com', password: 'MauvaisMotDePasse1' })

    expect(res.status).toBe(401)
    expect(res.body.message).toMatch(/invalides/i)
  })

  it('401 — rejette un email inexistant', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'inexistant@test-jest.com', password: 'Password1' })

    expect(res.status).toBe(401)
  })

  it('400 — rejette si email manquant', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ password: 'Password1' })

    expect(res.status).toBe(400)
  })

})

// ─── GET /me ───────────────────────────────────────────────────────────────────
describe('GET /api/users/me', () => {

  let accessToken: string

  beforeAll(async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ email: 'me@test-jest.com', password: 'Password1' })

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'me@test-jest.com', password: 'Password1' })

    accessToken = res.body.accessToken
  })

  it('200 — retourne les infos de l\'utilisateur connecté', async () => {
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(res.status).toBe(200)
    expect(res.body.email).toBe('me@test-jest.com')
    expect(res.body).not.toHaveProperty('password')
  })

  it('401 — refuse sans token', async () => {
    const res = await request(app).get('/api/users/me')
    expect(res.status).toBe(401)
  })

  it('401 — refuse avec un token invalide', async () => {
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', 'Bearer token.invalide.ici')

    expect(res.status).toBe(401)
  })

})

// ─── REFRESH TOKEN ─────────────────────────────────────────────────────────────
describe('POST /api/auth/refresh', () => {

  let refreshToken: string

  beforeAll(async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ email: 'refresh@test-jest.com', password: 'Password1' })

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'refresh@test-jest.com', password: 'Password1' })

    refreshToken = res.body.refreshToken
  })

  it('200 — retourne de nouveaux tokens', async () => {
    const res = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken })

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('accessToken')
    expect(res.body).toHaveProperty('refreshToken')
  })

  it('401 — refuse un refresh token invalide', async () => {
    const res = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken: 'faux-refresh-token' })

    expect(res.status).toBe(401)
  })

})

// ─── LOGOUT ────────────────────────────────────────────────────────────────────
describe('POST /api/auth/logout', () => {

  it('200 — déconnexion réussie', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ email: 'logout@test-jest.com', password: 'Password1' })

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'logout@test-jest.com', password: 'Password1' })

    const res = await request(app)
      .post('/api/auth/logout')
      .send({ refreshToken: loginRes.body.refreshToken })

    expect(res.status).toBe(200)
  })

})

// ─── HEALTH ────────────────────────────────────────────────────────────────────
describe('GET /health', () => {
  it('200 — retourne le statut ok', async () => {
    const res = await request(app).get('/health')
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('ok')
  })
})
