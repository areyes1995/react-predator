// ──────────────────────────────────────────────
// Login — Sign in page
// Split layout: left branding / right form
// ──────────────────────────────────────────────

import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FormField, FormInput, FormButton, TextCarousel } from '../components/ui'

export default function Login() {
  const { login, isAuthenticated, isSubmitting, error, clearError } = useAuth()
  const navigate = useNavigate()

  // ─── Redirigir si ya está autenticado ────────
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app', { replace: true })
    }
  }, [isAuthenticated, navigate])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // ─── Text carousel ──────────────────────────────
  const carouselItems = [
    'Generate detailed reports with real-time data',
    'View and manage users effortlessly',
    // 'Schedule and track coaching sessions',
    // 'Manage licenses and subscriptions',
    // 'Track vacations and time-off requests',
    'Create customized performance reports',
  ]
  const [carouselIndex, setCarouselIndex] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex(i => (i + 1) % carouselItems.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) return
    login({ email: email.trim(), password })
  }

  return (
    <div className="login-root">
      {/* ─── Left side — Branding ─── */}
      <div className="login-brand">
        <div className="login-brand-glow" />
        <div className="login-brand-content">
          <div className="login-logo-box">
            <img src="/logo.png" alt="Modu Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <h1 className="login-brand-title">
            The platform for <span className="login-brand-accent">transforming</span> your work
          </h1>
                  <div className="login-carousel">
            <TextCarousel items={carouselItems} currentIndex={carouselIndex} />
          </div>
        </div>
        <div className="login-brand-footer">
            {carouselItems.map((_, i) => (
            <span
              key={i}
              className={`login-dot ${i !== carouselIndex ? 'login-dot-muted' : ''}`}
            />
          ))}
        </div>
      </div>

      {/* ─── Right side — Form ─── */}
      <div className="login-form-side">
        <div className="login-form-container">
          {/* Header */}
          <div className="login-form-header">
            <img src="/logo.png" alt="Modu Logo" className="login-form-logo" style={{ width: '2.5rem', height: '2.5rem', objectFit: 'contain' }} />
            {/* <p className="login-signup-text">
              Don't have an account? <a href="#">Sign up</a>
            </p> */}
          </div>

          <div className="login-form-body">
            <h2 className="login-form-title">Welcome to Modu</h2>
            <p className="login-form-subtitle">
              Enter your credentials to access your account.
            </p>

            {/* Error */}
            {error && (
              <div className="login-error" role="alert">
                <span>{error}</span>
                <button type="button" onClick={clearError} aria-label="Close">&times;</button>
              </div>
            )}

            {/* Botones sociales */}
            {/* <div className="login-social">
              <button type="button" className="login-social-btn" disabled={isSubmitting}>
                <svg viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Continuar con Google
              </button>
              <button type="button" className="login-social-btn login-social-btn-dark" disabled={isSubmitting}>
                <svg viewBox="0 0 384 512"><path fill="currentColor" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 126.7 21.8 0 34.1-16.6 65.4-16.6 31.3 0 42.4 16.6 65.4 16.6 48.2 0 91.6-83.7 104.4-119.3-39.6-16.2-64.1-53-64.1-93.4zM277.5 73.6c20.3-25.9 33.7-61.1 30-97.6-31.7 1.4-69.6 21.2-92.4 47.7-18.1 20.7-33.1 56.7-29.4 90.9 35.1 2.7 70.8-15.1 91.8-41z"/></svg>
                Continuar con Apple
              </button>
            </div> */}

            {/* Separador */}
            <div className="login-divider">
              <span>Sign in Here</span>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="login-form">
              <FormField label="Email" htmlFor="email">
                <FormInput
                  id="email"
                  type="email"
                  placeholder="name@email.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); clearError() }}
                  required
                  autoFocus
                  autoComplete="email"
                  disabled={isSubmitting}
                />
              </FormField>

              <FormField label="Password" htmlFor="password">
                <FormInput
                  id="password"
                  type="password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={e => { setPassword(e.target.value); clearError() }}
                  required
                  autoComplete="current-password"
                  disabled={isSubmitting}
                />
              </FormField>

              <FormButton
                loading={isSubmitting}
                loadingText="Signing in…"
                icon={
                  <svg className="form-arrow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                }
              >
                Sign in
              </FormButton>
            </form>

            <div className="login-forgot">
              <a href="#">Forgot your password?</a>
            </div>

            <div className="login-demo-hint">
              <span className="login-method-badge">🔒 Secure Login</span>
              Use your institutional credentials to sign in.
            </div>
          </div>

          {/* Footer */}
          <footer className="login-footer">
            <p>&copy; {new Date().getFullYear()} Modu. All rights reserved.</p>
            <div>
              <a href="#">Privacy Policy</a>
              <a href="#">Support</a>
            </div>
          </footer>
        </div>
      </div>

      {/* ── Styles ── */}
      <style>{`
        /* ── Reset ── */
        .login-root {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          background: #fff;
        }

        /* ─── Lado izquierdo (brand) ─── */
        .login-brand {
          background: #0a0a0c;
          padding: 5rem 4rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          overflow: hidden;
          color: #fff;
        }
        .login-brand-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at top right, rgba(242,169,59,0.12), transparent 50%);
          pointer-events: none;
        }
        .login-brand-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .login-logo-box {
          width: 6rem;
          height: 6rem;
          border: 1px solid #1f1f23;
          border-radius: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.25rem;
          margin-bottom: 3rem;
          color: #f2a93b;
          background: #0a0a0c;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.03);
        }

        .login-brand-title {
          font-size: 2.75rem;
          font-weight: 700;
          line-height: 1.2;
          max-width: 24rem;
          margin: 0;
        }
        .login-brand-accent {
          color: #f2a93b;
        }
        .login-carousel {
          width: 100%;
          max-width: 22rem;
          min-height: 3.2rem;
          margin-top: 1.25rem;
          position: relative;
          overflow: hidden;
        }
        .text-carousel {
          position: relative;
          width: 100%;
          height: 100%;
        }
        .text-carousel-item {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.5s ease, transform 0.5s ease;
          color: #9ca3af;
          font-size: 1.125rem;
          line-height: 1.6;
          pointer-events: none;
        }
        .text-carousel-item--active {
          opacity: 1;
          transform: translateY(0);
        }
        .login-brand-footer {
          display: flex;
          justify-content: center;
          gap: 0.75rem;
          margin-top: 3rem;
          position: relative;
          z-index: 1;
        }
        .login-dot {
          width: 0.75rem;
          height: 0.75rem;
          border-radius: 50%;
          background: #fff;
        }
        .login-dot-muted {
          background: #374151;
        }

        /* ─── Lado derecho (formulario) ─── */
        .login-form-side {
          display: flex;
          flex-direction: column;
          padding: 2.5rem 4rem;
        }
        .login-form-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          max-width: 28rem;
          margin: 0 auto;
          width: 100%;
        }

        /* Header del formulario */
        .login-form-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 3rem;
        }
        .login-form-logo {
          width: 2.5rem;
          height: 2.5rem;
          color: #0a0a0c;
        }
        .login-signup-text {
          font-size: 0.9375rem;
          color: #6b7280;
          margin: 0;
        }
        .login-signup-text a {
          color: #0a0a0c;
          font-weight: 600;
          text-decoration: none;
        }
        .login-signup-text a:hover {
          text-decoration: underline;
          text-decoration-color: #f2a93b;
          text-underline-offset: 2px;
        }

        /* Cuerpo del formulario */
        .login-form-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .login-form-title {
          font-size: 2rem;
          font-weight: 700;
          color: #0a0a0c;
          margin: 0;
          text-align: center;
        }
        .login-form-subtitle {
          color: #6b7280;
          font-size: 1rem;
          margin: 0.5rem 0 2rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.375rem;
        }
        .login-auth-method {
          font-size: 0.6875rem;
          font-weight: 600;
          color: #9ca3af;
          background: #f9fafb;
          padding: 0.2rem 0.625rem;
          border-radius: 999px;
          letter-spacing: 0.03em;
          text-transform: uppercase;
        }

        /* Error */
        .login-error {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #b91c1c;
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          margin-bottom: 1.25rem;
        }
        .login-error button {
          background: none;
          border: none;
          color: #b91c1c;
          font-size: 1.25rem;
          cursor: pointer;
          padding: 0 0.25rem;
          line-height: 1;
        }

        /* Botones sociales */
        .login-social {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }
        .login-social-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.625rem;
          padding: 0.75rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 0.75rem;
          background: #fff;
          color: #374151;
          font-size: 0.9375rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
        }
        .login-social-btn svg {
          width: 1.25rem;
          height: 1.25rem;
        }
        .login-social-btn:hover:not(:disabled) {
          background: #f9fafb;
          border-color: #9ca3af;
        }
        .login-social-btn-dark {
          background: #0a0a0c;
          color: #fff;
          border-color: #0a0a0c;
        }
        .login-social-btn-dark:hover:not(:disabled) {
          background: #000;
        }

        /* Separador */
        .login-divider {
          position: relative;
          margin-bottom: 1.5rem;
        }
        .login-divider::before {
          content: '';
          position: absolute;
          inset: 50% 0 0;
          border-top: 1px solid #e5e7eb;
        }
        .login-divider span {
          position: relative;
          display: block;
          text-align: center;
          font-size: 0.8125rem;
          color: #9ca3af;
          background: #fff;
          padding: 0 0.75rem;
          width: fit-content;
          margin: 0 auto;
        }

        /* Campos */
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .form-field {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
        }
        .form-field label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
        }
        .form-field-error {
          font-size: 0.75rem;
          color: #b91c1c;
        }
        .form-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .form-input-icon {
          position: absolute;
          left: 0.875rem;
          color: #9ca3af;
          display: flex;
          align-items: center;
          pointer-events: none;
        }
        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 0.75rem;
          font-size: 0.9375rem;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          background: #fff;
          color: #111827;
          box-sizing: border-box;
        }
        .form-input--with-icon {
          padding-left: 2.5rem;
        }
        .form-input::placeholder {
          color: #9ca3af;
        }
        .form-input:focus {
          border-color: #f2a93b;
          box-shadow: 0 0 0 3px rgba(242, 169, 59, 0.15);
        }
        .form-input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Botón submit */
        .form-submit-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.875rem 1.5rem;
          background: linear-gradient(135deg, #f2a93b, #f5b961);
          color: #fff;
          font-size: 1rem;
          font-weight: 600;
          border: none;
          border-radius: 0.75rem;
          cursor: pointer;
          transition: all 0.15s;
          box-shadow: 0 4px 12px rgba(242, 169, 59, 0.25);
          margin-top: 0.5rem;
        }
        .form-submit-btn:hover:not(:disabled) {
          box-shadow: 0 6px 20px rgba(242, 169, 59, 0.35);
          transform: translateY(-1px);
        }
        .form-submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }
        .form-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .form-arrow {
          width: 1.125rem;
          height: 1.125rem;
        }
        .form-btn-loading {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }
        .form-spinner {
          width: 1rem;
          height: 1rem;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: form-spin 0.6s linear infinite;
        }
        @keyframes form-spin {
          to { transform: rotate(360deg); }
        }

        .login-forgot {
          text-align: center;
          margin-top: 1.5rem;
        }
        .login-forgot a {
          color: #6b7280;
          font-size: 0.875rem;
          text-decoration: none;
        }
        .login-forgot a:hover {
          color: #0a0a0c;
          text-decoration: underline;
          text-decoration-color: #f2a93b;
        }

        .login-demo-hint {
          text-align: center;
          font-size: 0.75rem;
          color: #9ca3af;
          margin-top: 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        .login-demo-hint strong {
          color: #6b7280;
        }
        .login-method-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          background: #f3f4f6;
          padding: 0.25rem 0.625rem;
          border-radius: 999px;
          font-size: 0.6875rem;
          font-weight: 600;
          color: #374151;
          letter-spacing: 0.02em;
        }

        /* Footer */
        .login-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8125rem;
          color: #9ca3af;
          padding-top: 2rem;
          border-top: 1px solid #f3f4f6;
          margin-top: auto;
        }
        .login-footer a {
          color: #9ca3af;
          text-decoration: none;
          margin-left: 1.5rem;
        }
        .login-footer a:hover {
          color: #374151;
        }

        /* ─── Responsive ─── */
        @media (max-width: 1024px) {
          .login-root {
            grid-template-columns: 1fr;
          }
          .login-brand {
            display: none;
          }
          .login-form-side {
            padding: 2rem 1.5rem;
          }
        }
      `}</style>
    </div>
  )
}