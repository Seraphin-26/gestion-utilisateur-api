import { Request, Response, NextFunction } from 'express'
import { authMiddleware, requireRole } from '../../middleware/auth.middleware'
import { generateAccessToken } from '../../utils/jwt'

// Helper pour créer des mocks Express
const mockReq  = (headers = {}) => ({ headers } as unknown as Request)
const mockRes  = () => {
  const res = {} as Response
  res.status = jest.fn().mockReturnValue(res)
  res.json   = jest.fn().mockReturnValue(res)
  return res
}
const mockNext = jest.fn() as NextFunction

beforeEach(() => jest.clearAllMocks())

describe('authMiddleware', () => {

  it('doit appeler next() avec un token valide', () => {
    const token = generateAccessToken(1, 'USER')
    const req   = mockReq({ authorization: `Bearer ${token}` })
    const res   = mockRes()

    authMiddleware(req as any, res, mockNext)

    expect(mockNext).toHaveBeenCalledTimes(1)
    expect((req as any).userId).toBe(1)
    expect((req as any).userRole).toBe('USER')
  })

  it('doit retourner 401 si pas de header Authorization', () => {
    const req = mockReq({})
    const res = mockRes()

    authMiddleware(req as any, res, mockNext)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('doit retourner 401 si le format est incorrect (sans Bearer)', () => {
    const token = generateAccessToken(1, 'USER')
    const req   = mockReq({ authorization: token }) // pas de "Bearer "
    const res   = mockRes()

    authMiddleware(req as any, res, mockNext)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('doit retourner 401 si le token est invalide', () => {
    const req = mockReq({ authorization: 'Bearer token.invalide.ici' })
    const res = mockRes()

    authMiddleware(req as any, res, mockNext)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(mockNext).not.toHaveBeenCalled()
  })

})

describe('requireRole', () => {

  it('doit appeler next() si le rôle est autorisé', () => {
    const req = { userRole: 'ADMIN' } as any
    const res = mockRes()

    requireRole('ADMIN')(req, res, mockNext)

    expect(mockNext).toHaveBeenCalledTimes(1)
  })

  it('doit retourner 403 si le rôle est insuffisant', () => {
    const req = { userRole: 'USER' } as any
    const res = mockRes()

    requireRole('ADMIN')(req, res, mockNext)

    expect(res.status).toHaveBeenCalledWith(403)
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('doit accepter plusieurs rôles autorisés', () => {
    const req = { userRole: 'MODERATOR' } as any
    const res = mockRes()

    requireRole('ADMIN', 'MODERATOR')(req, res, mockNext)

    expect(mockNext).toHaveBeenCalledTimes(1)
  })

  it('doit retourner 403 si pas de rôle', () => {
    const req = {} as any
    const res = mockRes()

    requireRole('ADMIN')(req, res, mockNext)

    expect(res.status).toHaveBeenCalledWith(403)
  })

})
