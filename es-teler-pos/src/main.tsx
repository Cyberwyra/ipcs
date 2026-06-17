import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PosProvider } from './context/PosContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PosProvider>
      <App />
    </PosProvider>
  </StrictMode>,
)
