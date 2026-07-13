import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { trackFirstOpen } from './utils/analytics'

// Traccia il primo avvio dell'app
trackFirstOpen()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
