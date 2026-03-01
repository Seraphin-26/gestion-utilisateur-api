import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import prisma from '../models/prisma'
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt'
import { sendVerificationEmail, sendResetPasswordEmail } from '../utils/email'

const SALT_ROUNDS = 12

const userSelect = {
  id: true, email: true, firstName: true, lastName: true,
  role: true, avatar: true, isEmailVerified: true,
  createdAt: true, updatedAt: true,
}

export const registerUser = async (
  email: string, password: string,
  firstName?: string, lastName?: string
) => {
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) throw new Error('Cet email est déjà utilisé')

  const hashedPassword   = await bcrypt.hash(password, SALT_ROUNDS)
  const emailVerifyToken = uuidv4()

  const user = await prisma.user.create({
    data: { email, password: hashedPassword, emailVerifyToken, firstName, lastName },
    select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true },
  })

  sendVerificationEmail(email, emailVerifyToken).catch(console.error)
  return user
}

export const verifyEmail = async (token: string) => {
  const user = await prisma.user.findFirst({ where: { emailVerifyToken: token } })
  if (!user) throw new Error('Token invalide ou expiré')
  await prisma.user.update({
    where: { id: user.id },
    data: { isEmailVerified: true, emailVerifyToken: null },
  })
}

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw new Error('Identifiants invalides')

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) throw new Error('Identifiants invalides')

  const accessToken  = generateAccessToken(user.id, user.role)
  const refreshToken = generateRefreshToken(user.id)

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  await prisma.refreshToken.create({
    data: { token: refreshToken, userId: user.id, expiresAt },
  })

  return {
    accessToken, refreshToken,
    user: {
      id: user.id, email: user.email,
      firstName: user.firstName, lastName: user.lastName,
      role: user.role, isEmailVerified: user.isEmailVerified,
    },
  }
}

export const refreshAccessToken = async (refreshToken: string) => {
  const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } })
  if (!stored || stored.expiresAt < new Date()) {
    if (stored) await prisma.refreshToken.delete({ where: { token: refreshToken } })
    throw new Error('Refresh token invalide ou expiré')
  }

  const decoded = verifyRefreshToken(refreshToken)
  const user    = await prisma.user.findUnique({ where: { id: decoded.userId } })
  if (!user) throw new Error('Utilisateur introuvable')

  const newAccessToken  = generateAccessToken(user.id, user.role)
  const newRefreshToken = generateRefreshToken(user.id)
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  await prisma.refreshToken.delete({ where: { token: refreshToken } })
  await prisma.refreshToken.create({ data: { token: newRefreshToken, userId: user.id, expiresAt } })

  return { accessToken: newAccessToken, refreshToken: newRefreshToken }
}

export const logoutUser = async (refreshToken: string) => {
  await prisma.refreshToken.deleteMany({ where: { token: refreshToken } })
}

export const getUserById = async (id: number) => {
  const user = await prisma.user.findUnique({ where: { id }, select: userSelect })
  if (!user) throw new Error('Utilisateur non trouvé')
  return user
}

export const updateProfile = async (
  id: number,
  data: { email?: string; firstName?: string | null; lastName?: string | null }
) => {
  if (data.email) {
    const existing = await prisma.user.findFirst({ where: { email: data.email, NOT: { id } } })
    if (existing) throw new Error('Cet email est déjà utilisé')
  }
  return await prisma.user.update({ where: { id }, data, select: userSelect })
}

export const changePassword = async (id: number, currentPassword: string, newPassword: string) => {
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) throw new Error('Utilisateur non trouvé')
  const isValid = await bcrypt.compare(currentPassword, user.password)
  if (!isValid) throw new Error('Mot de passe actuel incorrect')
  const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS)
  await prisma.user.update({ where: { id }, data: { password: hashed } })
  await prisma.refreshToken.deleteMany({ where: { userId: id } })
}

export const updateAvatar = async (id: number, filename: string) => {
  return await prisma.user.update({
    where: { id },
    data: { avatar: `/uploads/${filename}` },
    select: { id: true, avatar: true },
  })
}

export const deleteAccount = async (id: number, password: string) => {
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) throw new Error('Utilisateur non trouvé')
  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) throw new Error('Mot de passe incorrect')
  await prisma.user.delete({ where: { id } })
}

export const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return
  const token = uuidv4()
  const exp   = new Date(Date.now() + 60 * 60 * 1000)
  await prisma.user.update({
    where: { id: user.id },
    data: { resetPasswordToken: token, resetPasswordExp: exp },
  })
  sendResetPasswordEmail(email, token).catch(console.error)
}

export const resetPassword = async (token: string, newPassword: string) => {
  const user = await prisma.user.findFirst({
    where: { resetPasswordToken: token, resetPasswordExp: { gt: new Date() } },
  })
  if (!user) throw new Error('Token invalide ou expiré')
  const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS)
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashed, resetPasswordToken: null, resetPasswordExp: null },
  })
  await prisma.refreshToken.deleteMany({ where: { userId: user.id } })
}

export const listUsers = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip, take: limit,
      select: { id: true, email: true, firstName: true, lastName: true, role: true, avatar: true, isEmailVerified: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count(),
  ])
  return { users, total, page, totalPages: Math.ceil(total / limit) }
}

export const updateUserRole = async (userId: number, role: 'USER' | 'MODERATOR' | 'ADMIN') => {
  return await prisma.user.update({
    where: { id: userId },
    data: { role },
    select: { id: true, email: true, role: true },
  })
}

export const adminDeleteUser = async (userId: number) => {
  await prisma.user.delete({ where: { id: userId } })
}