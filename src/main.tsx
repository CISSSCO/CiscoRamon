import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './app/App'
import './styles/global.css'

import { OrbStateProvider } from './app/OrbStateContext'
import { SectionIndexProvider } from './app/SectionIndexContext'
import { ThemeProvider } from './app/ThemeContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <SectionIndexProvider>
          <OrbStateProvider>
            <App />
          </OrbStateProvider>
        </SectionIndexProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)
