import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Star, ChevronDown } from 'lucide-react'
import { useStorage } from '../../context/StorageContext'
import { allCalculators } from '../../data/calculators'
import './FavoritesDropdown.css'

function FavoritesDropdown() {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null)
    const { favorites } = useStorage()

    // Get favorite tools data
    const favoriteTools = allCalculators.filter(calc =>
        favorites.includes(calc.path)
    )

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isOpen])

    // Close on escape
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') setIsOpen(false)
        }
        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [])

    return (
        <div className="favorites-dropdown" ref={dropdownRef}>
            <button
                className={`favorites-trigger ${favorites.length > 0 ? 'has-items' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Favorites"
                title="Your Favorites"
            >
                <Star size={18} fill={favorites.length > 0 ? 'currentColor' : 'none'} />
                {favorites.length > 0 && (
                    <span className="favorites-count">{favorites.length}</span>
                )}
                <ChevronDown size={14} className={`favorites-chevron ${isOpen ? 'open' : ''}`} />
            </button>

            {isOpen && (
                <div className="favorites-menu">
                    <div className="favorites-header">
                        <Star size={16} />
                        <span>Your Favorites</span>
                    </div>

                    {favoriteTools.length === 0 ? (
                        <div className="favorites-empty">
                            <p>No favorites yet</p>
                            <span>Star tools to add them here</span>
                        </div>
                    ) : (
                        <div className="favorites-list">
                            {favoriteTools.slice(0, 6).map((tool) => {
                                const ToolIcon = tool.icon
                                return (
                                    <Link
                                        key={tool.path}
                                        to={tool.path}
                                        className="favorites-item"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <div className="favorites-item-icon">
                                            <ToolIcon size={16} />
                                        </div>
                                        <span className="favorites-item-name">{tool.name}</span>
                                    </Link>
                                )
                            })}
                        </div>
                    )}

                    {favoriteTools.length > 6 && (
                        <div className="favorites-footer">
                            +{favoriteTools.length - 6} more favorites
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default FavoritesDropdown
