import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './atoms/globals.css'

// PrimeReact styles
import 'primereact/resources/themes/lara-light-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
