import nodemailer from 'nodemailer'
import { env } from '../config/env'

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: parseInt(env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
})

export const sendVerificationEmail = async (email: string, token: string) => {
  const url = `${env.CLIENT_URL}/verify-email?token=${token}`

  await transporter.sendMail({
    from: env.EMAIL_FROM,
    to: email,
    subject: 'Vérifiez votre adresse email',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Bienvenue sur UserAPI !</h2>
        <p>Cliquez sur le bouton ci-dessous pour vérifier votre email :</p>
        <a href="${url}" style="
          display: inline-block;
          background: #7c6aff;
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: bold;
          margin: 16px 0;
        ">Vérifier mon email</a>
        <p style="color: #666;">Ce lien expire dans 24 heures.</p>
        <p style="color: #666;">Si vous n'avez pas créé de compte, ignorez cet email.</p>
      </div>
    `,
  })
}

export const sendResetPasswordEmail = async (email: string, token: string) => {
  const url = `${env.CLIENT_URL}/reset-password?token=${token}`

  await transporter.sendMail({
    from: env.EMAIL_FROM,
    to: email,
    subject: 'Réinitialisation de votre mot de passe',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Réinitialisation du mot de passe</h2>
        <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez ci-dessous :</p>
        <a href="${url}" style="
          display: inline-block;
          background: #7c6aff;
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: bold;
          margin: 16px 0;
        ">Réinitialiser mon mot de passe</a>
        <p style="color: #666;">Ce lien expire dans 1 heure.</p>
        <p style="color: #666;">Si vous n'avez pas fait cette demande, ignorez cet email.</p>
      </div>
    `,
  })
}
