import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './app/App'
import { OrbStateProvider } from './app/OrbStateContext'
import './styles/global.css'
import { SectionIndexProvider } from './app/SectionIndexContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
    <BrowserRouter>
    <OrbStateProvider>
    <SectionIndexProvider>
    <App />
    </SectionIndexProvider>
    </OrbStateProvider>
    </BrowserRouter>
    </React.StrictMode>
)
