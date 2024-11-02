import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './input.css'
import { UIProvider } from '@yamada-ui/react'
import { AuthProvider } from './contexts/AuthContext.tsx'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UIProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </UIProvider>
  </StrictMode >
)
