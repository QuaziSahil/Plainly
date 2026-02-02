import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { StorageProvider } from './context/StorageContext'
import { SettingsProvider } from './context/SettingsContext'
import Settings from './components/Settings/Settings'
import App from './App'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <HelmetProvider>
            <BrowserRouter>
                <SettingsProvider>
                    <StorageProvider>
                        <App />
                        <Settings />
                    </StorageProvider>
                </SettingsProvider>
            </BrowserRouter>
        </HelmetProvider>
    </React.StrictMode>
)

