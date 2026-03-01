import api from './api'
import type { LoginResponse, RegisterResponse, User } from '../types'

export const authService = {
  login:    (email: string, password: string) =>
    api.post<LoginResponse>('/auth/login', { email, password }).then(r => r.data),

  register: (email: string, password: string) =>
    api.post<RegisterResponse>('/auth/register', { email, password }).then(r => r.data),

  logout:   (refreshToken: string) =>
    api.post('/auth/logout', { refreshToken }),

  getMe:    () =>
    api.get<User>('/users/me').then(r => r.data),

  updateProfile: (data: { email?: string; firstName?: string; lastName?: string }) =>
  api.put('/users/me', data).then(r => r.data),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.put('/users/me/password', { currentPassword, newPassword }).then(r => r.data),

  uploadAvatar: (file: File) => {
    const form = new FormData()
    form.append('avatar', file)
    return api.post('/users/me/avatar', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data)
  },

  deleteAccount: (password: string) =>
    api.delete('/users/me', { data: { password } }).then(r => r.data),

  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }).then(r => r.data),

  // Admin
  listUsers: (page = 1, limit = 10) =>
    api.get(`/users?page=${page}&limit=${limit}`).then(r => r.data),

  updateUserRole: (id: number, role: string) =>
    api.put(`/users/${id}/role`, { role }).then(r => r.data),

  deleteUser: (id: number) =>
    api.delete(`/users/${id}`).then(r => r.data),
}
