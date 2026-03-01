import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import axios from 'axios'
import { authService } from '../services/auth.service'
import { useAuthStore } from '../store/auth.store'
import type { ApiError } from '../types'

const errMsg = (e: unknown, fallback: string) =>
  axios.isAxiosError(e) ? (e.response?.data as ApiError)?.message ?? fallback : fallback

export function useLogin() {
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.login(email, password),
    onSuccess: (data) => {
      setAuth(data.accessToken, data.refreshToken, data.user)
      toast.success(t('auth.loginSuccess'))
      navigate('/dashboard')
    },
    onError: (e) => toast.error(errMsg(e, t('common.error'))),
  })
}

export function useRegister() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.register(email, password),
    onSuccess: () => {
      toast.success(t('auth.registerSuccess'))
      navigate('/login')
    },
    onError: (e) => toast.error(errMsg(e, t('common.error'))),
  })
}

export function useLogout() {
  const { refreshToken, logout } = useAuthStore()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const qc = useQueryClient()

  return () => {
    if (refreshToken) authService.logout(refreshToken).catch(() => {})
    logout()
    qc.clear()
    toast.success(t('auth.logoutSuccess'))
    navigate('/login')
  }
}

export function useMe() {
  const { isAuthenticated } = useAuthStore()
  return useQuery({
    queryKey: ['me'],
    queryFn: authService.getMe,
    enabled: isAuthenticated,
  })
}

export function useUpdateProfile() {
  const { t } = useTranslation()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (data: { email?: string; firstName?: string; lastName?: string }) =>
      authService.updateProfile(data),
    onSuccess: () => { toast.success(t('profile.emailUpdated')); qc.invalidateQueries({ queryKey: ['me'] }) },
    onError: (e) => toast.error(errMsg(e, t('common.error'))),
  })
}
export function useChangePassword() {
  const { t } = useTranslation()
  const logout = useLogout()

  return useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      authService.changePassword(currentPassword, newPassword),
    onSuccess: () => { toast.success(t('profile.passwordUpdated')); setTimeout(logout, 1500) },
    onError: (e) => toast.error(errMsg(e, t('common.error'))),
  })
}

export function useUploadAvatar() {
  const { t } = useTranslation()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (file: File) => authService.uploadAvatar(file),
    onSuccess: () => { toast.success(t('profile.avatarUpdated')); qc.invalidateQueries({ queryKey: ['me'] }) },
    onError: (e) => toast.error(errMsg(e, t('common.error'))),
  })
}

export function useDeleteAccount() {
  const { logout } = useAuthStore()
  const navigate = useNavigate()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (password: string) => authService.deleteAccount(password),
    onSuccess: () => { logout(); toast.success(t('profile.accountDeleted')); navigate('/login') },
    onError: (e) => toast.error(errMsg(e, t('common.error'))),
  })
}

export function useForgotPassword() {
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
    onSuccess: () => toast.success(t('auth.forgotSuccess')),
    onError: (e) => toast.error(errMsg(e, t('common.error'))),
  })
}

export function useListUsers(page = 1) {
  return useQuery({
    queryKey: ['users', page],
    queryFn: () => authService.listUsers(page),
  })
}

export function useUpdateUserRole() {
  const { t } = useTranslation()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, role }: { id: number; role: string }) => authService.updateUserRole(id, role),
    onSuccess: () => { toast.success(t('admin.roleUpdated')); qc.invalidateQueries({ queryKey: ['users'] }) },
    onError: (e) => toast.error(errMsg(e, t('common.error'))),
  })
}

export function useDeleteUser() {
  const { t } = useTranslation()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => authService.deleteUser(id),
    onSuccess: () => { toast.success(t('admin.userDeleted')); qc.invalidateQueries({ queryKey: ['users'] }) },
    onError: (e) => toast.error(errMsg(e, t('common.error'))),
  })
}
