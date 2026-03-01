import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } from '../../utils/jwt'

describe('Utils JWT', () => {

  describe('generateAccessToken', () => {
    it('doit générer un token valide', () => {
      const token = generateAccessToken(1, 'USER')
      expect(typeof token).toBe('string')
      expect(token.split('.')).toHaveLength(3) // format JWT : header.payload.signature
    })

    it('le token doit contenir userId et role', () => {
      const token = generateAccessToken(42, 'ADMIN')
      const decoded = verifyAccessToken(token)
      expect(decoded.userId).toBe(42)
      expect(decoded.role).toBe('ADMIN')
    })
  })

  describe('generateRefreshToken', () => {
    it('doit générer un refresh token valide', () => {
      const token = generateRefreshToken(1)
      expect(typeof token).toBe('string')
      expect(token.split('.')).toHaveLength(3)
    })

    it('le refresh token doit contenir userId', () => {
      const token = generateRefreshToken(99)
      const decoded = verifyRefreshToken(token)
      expect(decoded.userId).toBe(99)
    })
  })

  describe('verifyAccessToken', () => {
    it('doit lever une erreur avec un token invalide', () => {
      expect(() => verifyAccessToken('token.invalide.ici')).toThrow()
    })

    it('doit lever une erreur avec un token vide', () => {
      expect(() => verifyAccessToken('')).toThrow()
    })

    it('doit lever une erreur avec un token falsifié', () => {
      const token = generateAccessToken(1, 'USER')
      const falsifie = token.slice(0, -5) + 'xxxxx'
      expect(() => verifyAccessToken(falsifie)).toThrow()
    })
  })

  describe('verifyRefreshToken', () => {
    it('doit lever une erreur avec un refresh token invalide', () => {
      expect(() => verifyRefreshToken('faux.token.ici')).toThrow()
    })
  })

})
