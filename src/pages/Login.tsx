// ──────────────────────────────────────────────
// Login — Sign in page
// Full-screen dark gradient with centered form
// ──────────────────────────────────────────────

import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FormField, FormInput, FormButton } from '../components/ui'

export default function Login() {
  const { login, isAuthenticated, isSubmitting, error, clearError } = useAuth()
  const navigate = useNavigate()
  const appName = import.meta.env.VITE_APP_NAME || import.meta.env.VITE_APP_NAMESPACE || 'Modu'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app', { replace: true })
    }
  }, [isAuthenticated, navigate])



  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) return
    login({ email: email.trim(), password })
  }

  return (
    <div className="login-root">
      <div className="login-center">
        <div className="login-card">
          <div className="login-form-header">
            <div className="login-form-logo">
              <span className="login-form-logo-text">V</span>
            </div>
          </div>

          <div className="login-form-body">
            <h2 className="login-form-title">Welcome to {appName}</h2>
            <p className="login-form-subtitle">
              Enter your credentials to access your account.
            </p>

            {error && (
              <div className="login-error" role="alert">
                <span>{error}</span>
                <button type="button" onClick={clearError} aria-label="Close">&times;</button>
              </div>
            )}

            <div className="login-divider">
              <span>Sign in Here</span>
            </div>

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

          <footer className="login-footer">
            <p>&copy; {new Date().getFullYear()} {appName}. All rights reserved.</p>
            <div>
              <a href="#">Privacy Policy</a>
              <a href="#">Support</a>
            </div>
          </footer>
        </div>
      </div>

      <style>{`
        .login-root {
          min-height: 100vh;
          background: linear-gradient(135deg, #000000 0%, #111111 50%, #0a0a0c 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          color: #fff;
        }

        .login-center {
          width: 100%;
          max-width: 440px;
          padding: 2rem;
        }

        .login-card {
          background: rgba(20, 20, 20, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 1.5rem;
          padding: 2.5rem;
          backdrop-filter: blur(12px);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }

        .login-form-header {
          display: flex;
          justify-content: center;
          margin-bottom: 2rem;
        }
        .login-form-logo {
          width: 2.5rem;
          height: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f2a93b, #f5b961);
          border-radius: 0.75rem;
          box-shadow: 0 4px 12px rgba(242, 169, 59, 0.25);
        }
        .login-form-logo-text {
          font-size: 1.5rem;
          font-weight: 800;
          color: #fff;
          line-height: 1;
        }

        .login-form-body {
          display: flex;
          flex-direction: column;
        }
        .login-form-title {
          font-size: 2rem;
          font-weight: 700;
          color: #fff;
          margin: 0 0 0.5rem;
          text-align: center;
        }
        .login-form-subtitle {
          color: #9ca3af;
          font-size: 1rem;
          margin: 0 0 2rem;
          text-align: center;
        }

        .login-error {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(183, 42, 42, 0.15);
          border: 1px solid rgba(183, 42, 42, 0.3);
          color: #fca5a5;
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          margin-bottom: 1.25rem;
        }
        .login-error button {
          background: none;
          border: none;
          color: #fca5a5;
          font-size: 1.25rem;
          cursor: pointer;
          padding: 0 0.25rem;
          line-height: 1;
        }

        .login-divider {
          position: relative;
          margin-bottom: 1.5rem;
        }
        .login-divider::before {
          content: '';
          position: absolute;
          inset: 50% 0 0;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        .login-divider span {
          position: relative;
          display: block;
          text-align: center;
          font-size: 0.8125rem;
          color: #6b7280;
          background: transparent;
          padding: 0 0.75rem;
          margin: 0 auto;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .form-field label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #d1d5db;
        }
        .form-input-icon {
          position: absolute;
          left: 0.875rem;
          color: #6b7280;
          display: flex;
          align-items: center;
          pointer-events: none;
        }
        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.75rem;
          font-size: 0.9375rem;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
          box-sizing: border-box;
        }
        .form-input:focus {
          border-color: #f2a93b;
          box-shadow: 0 0 0 3px rgba(242, 169, 59, 0.15);
        }
        .form-input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .form-input::placeholder {
          color: #6b7280;
        }

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
          border: 2px solid rgba(255, 255, 255, 0.3);
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
          color: #9ca3af;
          font-size: 0.875rem;
          text-decoration: none;
        }
        .login-forgot a:hover {
          color: #f2a93b;
          text-decoration: underline;
        }

        .login-demo-hint {
          text-align: center;
          font-size: 0.75rem;
          color: #6b7280;
          margin-top: 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        .login-method-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          background: rgba(255, 255, 255, 0.08);
          padding: 0.25rem 0.625rem;
          border-radius: 999px;
          font-size: 0.6875rem;
          font-weight: 600;
          color: #9ca3af;
        }

        .login-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8125rem;
          color: #6b7280;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          margin-top: auto;
        }
        .login-footer a {
          color: #6b7280;
          text-decoration: none;
          margin-left: 1.5rem;
        }
        .login-footer a:hover {
          color: #f2a93b;
        }

        @media (max-width: 1024px) {
          .login-card {
            padding: 2rem 1.5rem;
          }
        }
      `}</style>
    </div>
  )
}
