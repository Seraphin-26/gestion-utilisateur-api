import {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  updateProfileSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../../validators/auth.validators'

describe('Validators Zod', () => {

  // ─── REGISTER ───────────────────────────────────────────────────────────────
  describe('registerSchema', () => {
    const valid = { email: 'test@example.com', password: 'Password1' }

    it('accepte des données valides', () => {
      expect(registerSchema.safeParse(valid).success).toBe(true)
    })

    it('accepte avec firstName et lastName optionnels', () => {
      const result = registerSchema.safeParse({ ...valid, firstName: 'Jean', lastName: 'Dupont' })
      expect(result.success).toBe(true)
    })

    it('rejette un email invalide', () => {
      const result = registerSchema.safeParse({ ...valid, email: 'pas-un-email' })
      expect(result.success).toBe(false)
    })

    it('rejette un mot de passe trop court', () => {
      const result = registerSchema.safeParse({ ...valid, password: 'Ab1' })
      expect(result.success).toBe(false)
    })

    it('rejette un mot de passe sans majuscule', () => {
      const result = registerSchema.safeParse({ ...valid, password: 'password1' })
      expect(result.success).toBe(false)
    })

    it('rejette un mot de passe sans chiffre', () => {
      const result = registerSchema.safeParse({ ...valid, password: 'Password' })
      expect(result.success).toBe(false)
    })

    it('rejette si email manquant', () => {
      const result = registerSchema.safeParse({ password: 'Password1' })
      expect(result.success).toBe(false)
    })
  })

  // ─── LOGIN ───────────────────────────────────────────────────────────────────
  describe('loginSchema', () => {
    it('accepte des identifiants valides', () => {
      const result = loginSchema.safeParse({ email: 'test@example.com', password: 'nimporte' })
      expect(result.success).toBe(true)
    })

    it('rejette un mot de passe vide', () => {
      const result = loginSchema.safeParse({ email: 'test@example.com', password: '' })
      expect(result.success).toBe(false)
    })

    it('rejette un email manquant', () => {
      const result = loginSchema.safeParse({ password: 'Password1' })
      expect(result.success).toBe(false)
    })
  })

  // ─── UPDATE PROFILE ───────────────────────────────────────────────────────────
  describe('updateProfileSchema', () => {
    it('accepte un email valide', () => {
      const result = updateProfileSchema.safeParse({ email: 'nouveau@example.com' })
      expect(result.success).toBe(true)
    })

    it('accepte firstName et lastName', () => {
      const result = updateProfileSchema.safeParse({ firstName: 'Marie', lastName: 'Curie' })
      expect(result.success).toBe(true)
    })

    it('accepte des données vides (tout optionnel)', () => {
      const result = updateProfileSchema.safeParse({})
      expect(result.success).toBe(true)
    })

    it('rejette un email invalide', () => {
      const result = updateProfileSchema.safeParse({ email: 'invalide' })
      expect(result.success).toBe(false)
    })
  })

  // ─── CHANGE PASSWORD ──────────────────────────────────────────────────────────
  describe('changePasswordSchema', () => {
    const valid = { currentPassword: 'AncienMdp1', newPassword: 'NouveauMdp1' }

    it('accepte des données valides', () => {
      expect(changePasswordSchema.safeParse(valid).success).toBe(true)
    })

    it('rejette si currentPassword vide', () => {
      const result = changePasswordSchema.safeParse({ ...valid, currentPassword: '' })
      expect(result.success).toBe(false)
    })

    it('rejette si newPassword sans majuscule', () => {
      const result = changePasswordSchema.safeParse({ ...valid, newPassword: 'nouveaumdp1' })
      expect(result.success).toBe(false)
    })
  })

  // ─── FORGOT PASSWORD ──────────────────────────────────────────────────────────
  describe('forgotPasswordSchema', () => {
    it('accepte un email valide', () => {
      expect(forgotPasswordSchema.safeParse({ email: 'test@example.com' }).success).toBe(true)
    })

    it('rejette un email invalide', () => {
      expect(forgotPasswordSchema.safeParse({ email: 'pas-email' }).success).toBe(false)
    })
  })

  // ─── RESET PASSWORD ───────────────────────────────────────────────────────────
  describe('resetPasswordSchema', () => {
    it('accepte des données valides', () => {
      const result = resetPasswordSchema.safeParse({ token: 'uuid-token', newPassword: 'NouveauMdp1' })
      expect(result.success).toBe(true)
    })

    it('rejette si token vide', () => {
      const result = resetPasswordSchema.safeParse({ token: '', newPassword: 'NouveauMdp1' })
      expect(result.success).toBe(false)
    })
  })

})
