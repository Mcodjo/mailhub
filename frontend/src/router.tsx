import { createBrowserRouter } from 'react-router-dom'
import { AppLayout }           from './components/layout/AppLayout'
import { LandingPage }         from './pages/public/LandingPage'
import { PricingPage }         from './pages/public/PricingPage'
import { LoginPage }           from './pages/public/LoginPage'
import { RegisterPage }        from './pages/public/RegisterPage'
import { ForgotPage }          from './pages/public/ForgotPage'
import { ResetPasswordPage }   from './pages/public/ResetPasswordPage'
import { InboxPage }           from './pages/app/InboxPage'
import { ComposePage }         from './pages/app/ComposePage'
import { WizardPage }          from './pages/app/WizardPage'
import { SettingsPage }        from './pages/app/SettingsPage'
import { OnboardingPage }      from './pages/app/OnboardingPage'

export const router = createBrowserRouter([
  /* ── Marketing ── */
  { path: '/',        element: <LandingPage /> },
  { path: '/pricing', element: <PricingPage /> },

  /* ── Auth public ── */
  { path: '/login',           element: <LoginPage /> },
  { path: '/register',        element: <RegisterPage /> },
  { path: '/forgot-password', element: <ForgotPage /> },
  { path: '/reset-password',  element: <ResetPasswordPage /> },

  /* ── App (protégé via AppLayout) ── */
  {
    path: '/app',
    element: <AppLayout />,
    children: [
      { path: 'inbox',      element: <InboxPage /> },
      { path: 'compose',    element: <ComposePage /> },
      { path: 'wizard',     element: <WizardPage /> },
      { path: 'settings',   element: <SettingsPage /> },
      { path: 'onboarding', element: <OnboardingPage /> },
    ],
  },

  /* ── Fallback ── */
  { path: '*', element: <LandingPage /> },
])
