import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import WeatherRiskApp from './WeatherRiskApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WeatherRiskApp />
  </StrictMode>,
)
