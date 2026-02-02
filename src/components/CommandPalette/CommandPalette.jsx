import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Command, ArrowRight, Star } from 'lucide-react'
import { allCalculators } from '../../data/calculators'
import { useStorage } from '../../context/StorageContext'
import './CommandPalette.css'

function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false)
    const [query, setQuery] = useState('')
    const [selectedIndex, setSelectedIndex] = useState(0)
    const inputRef = useRef(null)
    const navigate = useNavigate()
    const { favorites, history } = useStorage()

    // Filter tools based on query
    const filteredTools = useMemo(() => {
        if (!query.trim()) {
            // Show favorites first, then recent history
            const favoriteTools = allCalculators.filter(calc =>
                favorites.includes(calc.path)
            ).slice(0, 4)

            const recentTools = history
                .filter(h => !favorites.includes(h.path))
                .map(h => allCalculators.find(calc => calc.path === h.path))
                .filter(Boolean)
                .slice(0, 4)

            return [...favoriteTools, ...recentTools]
        }

        const lowerQuery = query.toLowerCase()
        return allCalculators
            .filter(calc =>
                calc.name.toLowerCase().includes(lowerQuery) ||
                calc.description.toLowerCase().includes(lowerQuery) ||
                calc.category.toLowerCase().includes(lowerQuery)
            )
            .slice(0, 8)
    }, [query, favorites, history])

    // Keyboard shortcut to open (Ctrl+K or /)
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ctrl+K or Cmd+K
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault()
                setIsOpen(true)
            }
            // "/" key when not focused on input
            if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
                e.preventDefault()
                setIsOpen(true)
            }
            // Escape to close
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false)
                setQuery('')
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [isOpen])

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isOpen])

    // Reset selected index when results change
    useEffect(() => {
        setSelectedIndex(0)
    }, [filteredTools])

    // Handle navigation with arrow keys
    const handleKeyNavigation = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setSelectedIndex(prev =>
                prev < filteredTools.length - 1 ? prev + 1 : prev
            )
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setSelectedIndex(prev => prev > 0 ? prev - 1 : prev)
        } else if (e.key === 'Enter' && filteredTools[selectedIndex]) {
            e.preventDefault()
            navigateToTool(filteredTools[selectedIndex].path)
        }
    }

    const navigateToTool = (path) => {
        navigate(path)
        setIsOpen(false)
        setQuery('')
    }

    const handleClose = () => {
        setIsOpen(false)
        setQuery('')
    }

    if (!isOpen) return null

    return (
        <div className="command-palette-overlay" onClick={handleClose}>
            <div className="command-palette" onClick={e => e.stopPropagation()}>
                {/* Search Input */}
                <div className="command-input-wrapper">
                    <Search size={18} className="command-search-icon" />
                    <input
                        ref={inputRef}
                        type="text"
                        className="command-input"
                        placeholder="Search 249+ tools..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyNavigation}
                    />
                    <kbd className="command-kbd">ESC</kbd>
                </div>

                {/* Results */}
                <div className="command-results">
                    {!query && (
                        <div className="command-section-label">
                            {favorites.length > 0 ? 'Favorites & Recent' : 'Recent Tools'}
                        </div>
                    )}

                    {filteredTools.length === 0 ? (
                        <div className="command-empty">
                            No tools found for "{query}"
                        </div>
                    ) : (
                        filteredTools.map((tool, index) => {
                            const ToolIcon = tool.icon
                            const isFavorite = favorites.includes(tool.path)
                            return (
                                <button
                                    key={tool.path}
                                    className={`command-result ${index === selectedIndex ? 'selected' : ''}`}
                                    onClick={() => navigateToTool(tool.path)}
                                    onMouseEnter={() => setSelectedIndex(index)}
                                >
                                    <div className="command-result-icon">
                                        <ToolIcon size={18} />
                                    </div>
                                    <div className="command-result-info">
                                        <span className="command-result-name">
                                            {tool.name}
                                            {isFavorite && <Star size={12} className="favorite-star" />}
                                        </span>
                                        <span className="command-result-category">{tool.category}</span>
                                    </div>
                                    <ArrowRight size={16} className="command-result-arrow" />
                                </button>
                            )
                        })
                    )}
                </div>

                {/* Footer hint */}
                <div className="command-footer">
                    <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
                    <span><kbd>↵</kbd> select</span>
                    <span><kbd>esc</kbd> close</span>
                </div>
            </div>
        </div>
    )
}

export default CommandPalette
