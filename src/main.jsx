import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { StorageProvider } from './context/StorageContext'
import { SettingsProvider } from './context/SettingsContext'
import Settings from './components/Settings/Settings'
import CommandPalette from './components/CommandPalette/CommandPalette'
import ToolRequestWidget from './components/ToolRequestWidget/ToolRequestWidget'
import AIAssistant from './components/AIAssistant/AIAssistant'
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
                        <CommandPalette />
                        <ToolRequestWidget />
                        <AIAssistant />
                    </StorageProvider>
                </SettingsProvider>
            </BrowserRouter>
        </HelmetProvider>
    </React.StrictMode>
)


