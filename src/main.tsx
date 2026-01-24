import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App'
import { ProjectFocusProvider } from './app/ProjectFocusContext'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ProjectFocusProvider>
      <App />
    </ProjectFocusProvider>
  </React.StrictMode>
)
