import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './app/App'
import { OrbStateProvider } from './app/OrbStateContext'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <OrbStateProvider>
        <App />
      </OrbStateProvider>
    </BrowserRouter>
  </React.StrictMode>
)
