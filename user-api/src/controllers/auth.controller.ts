import { Request, Response } from 'express'
import { AuthRequest } from '../middleware/auth.middleware'
import * as authService from '../services/auth.service'
import { upload } from '../config/multer'

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName } = req.body
    const user = await authService.registerUser(email, password, firstName, lastName)
    res.status(201).json({ message: 'Compte créé. Vérifiez votre email.', user })
  } catch (e: unknown) {
    res.status(400).json({ message: e instanceof Error ? e.message : 'Erreur serveur' })
  }
}

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    await authService.verifyEmail(req.query.token as string)
    res.json({ message: 'Email vérifié avec succès' })
  } catch (e: unknown) {
    res.status(400).json({ message: e instanceof Error ? e.message : 'Erreur serveur' })
  }
}

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await authService.loginUser(req.body.email, req.body.password)
    res.json(result)
  } catch (e: unknown) {
    res.status(401).json({ message: e instanceof Error ? e.message : 'Erreur serveur' })
  }
}

export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const tokens = await authService.refreshAccessToken(req.body.refreshToken)
    res.json(tokens)
  } catch (e: unknown) {
    res.status(401).json({ message: e instanceof Error ? e.message : 'Token invalide' })
  }
}

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    await authService.logoutUser(req.body.refreshToken)
    res.json({ message: 'Déconnecté avec succès' })
  } catch {
    res.status(200).json({ message: 'Déconnecté' })
  }
}

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await authService.getUserById(req.userId!)
    res.json(user)
  } catch (e: unknown) {
    res.status(404).json({ message: e instanceof Error ? e.message : 'Erreur serveur' })
  }
}

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, firstName, lastName } = req.body
    const user = await authService.updateProfile(req.userId!, { email, firstName, lastName })
    res.json(user)
  } catch (e: unknown) {
    res.status(400).json({ message: e instanceof Error ? e.message : 'Erreur serveur' })
  }
}

export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await authService.changePassword(req.userId!, req.body.currentPassword, req.body.newPassword)
    res.json({ message: 'Mot de passe modifié. Reconnectez-vous.' })
  } catch (e: unknown) {
    res.status(400).json({ message: e instanceof Error ? e.message : 'Erreur serveur' })
  }
}

export const uploadAvatar = [
  upload.single('avatar'),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ message: 'Aucun fichier fourni' })
        return
      }
      const user = await authService.updateAvatar(req.userId!, req.file.filename)
      res.json({ message: 'Avatar mis à jour', ...user })
    } catch (e: unknown) {
      res.status(400).json({ message: e instanceof Error ? e.message : 'Erreur upload' })
    }
  },
]

export const deleteAccount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await authService.deleteAccount(req.userId!, req.body.password)
    res.json({ message: 'Compte supprimé avec succès' })
  } catch (e: unknown) {
    res.status(400).json({ message: e instanceof Error ? e.message : 'Erreur serveur' })
  }
}

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  await authService.forgotPassword(req.body.email)
  res.json({ message: 'Si cet email existe, un lien de réinitialisation a été envoyé.' })
}

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    await authService.resetPassword(req.body.token, req.body.newPassword)
    res.json({ message: 'Mot de passe réinitialisé avec succès' })
  } catch (e: unknown) {
    res.status(400).json({ message: e instanceof Error ? e.message : 'Erreur serveur' })
  }
}

// ─── ADMIN ────────────────────────────────────────────────────────────────────
export const listUsers = async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1
  const limit = parseInt(req.query.limit as string) || 10
  const result = await authService.listUsers(page, limit)
  res.json(result)
}

export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await authService.updateUserRole(parseInt(req.params.id), req.body.role)
    res.json(user)
  } catch (e: unknown) {
    res.status(400).json({ message: e instanceof Error ? e.message : 'Erreur serveur' })
  }
}

export const adminDeleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    await authService.adminDeleteUser(parseInt(req.params.id))
    res.json({ message: 'Utilisateur supprimé' })
  } catch (e: unknown) {
    res.status(400).json({ message: e instanceof Error ? e.message : 'Erreur serveur' })
  }
}
