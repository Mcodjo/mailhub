import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { useAuthStore } from './store/auth'
import { me } from './api/auth'
import './styles/app.css'

export default function App() {
  const { setUser, setReady } = useAuthStore()

  useEffect(() => {
    // Hydrate l'état auth depuis le token localStorage (si présent)
    me()
      .then((user) => setUser(user))
      .catch(() => {})
      .finally(() => setReady(true))
  }, [])

  return <RouterProvider router={router} />
}
