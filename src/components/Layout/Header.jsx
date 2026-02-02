import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Search, Menu, X, Settings, ArrowRight, ChevronDown, Coffee } from 'lucide-react'
import { allCalculators } from '../../data/calculators'
import { useSettings } from '../../context/SettingsContext'
import FavoritesDropdown from '../FavoritesDropdown/FavoritesDropdown'
import './Header.css'

function Header() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [showDropdown, setShowDropdown] = useState(false)
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
    const [mobileSearchQuery, setMobileSearchQuery] = useState('')
    const searchRef = useRef(null)
    const categoryRef = useRef(null)
    const mobileSearchRef = useRef(null)
    const location = useLocation()
    const navigate = useNavigate()
    const { openSettings } = useSettings()

    const categories = [
        { name: 'AI Tools', path: '/ai' },
        { name: 'Finance', path: '/finance' },
        { name: 'Health', path: '/health' },
        { name: 'Math', path: '/math' },
        { name: 'Text', path: '/calculators?category=Text' },
        { name: 'Tech', path: '/calculators?category=Tech' },
        { name: 'Sustainability', path: '/calculators?category=Sustainability' },
        { name: 'Real Estate', path: '/calculators?category=Real%20Estate' },
        { name: 'Fun', path: '/calculators?category=Fun' },
        { name: 'Converter', path: '/converter' },
        { name: 'Other', path: '/calculators?category=Other' },
    ]

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        setIsMobileMenuOpen(false)
        setShowDropdown(false)
        setShowCategoryDropdown(false)
        setSearchQuery('')
        setMobileSearchQuery('')
    }, [location])

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowDropdown(false)
            }
            if (categoryRef.current && !categoryRef.current.contains(e.target)) {
                setShowCategoryDropdown(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [isMobileMenuOpen])

    // Filter calculators based on search query
    const filteredCalculators = searchQuery.trim()
        ? allCalculators.filter(calc =>
            calc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            calc.description.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 5)
        : []

    // Filter for mobile search
    const mobileFilteredCalculators = mobileSearchQuery.trim()
        ? allCalculators.filter(calc =>
            calc.name.toLowerCase().includes(mobileSearchQuery.toLowerCase()) ||
            calc.description.toLowerCase().includes(mobileSearchQuery.toLowerCase())
        ).slice(0, 5)
        : []

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/calculators?search=${encodeURIComponent(searchQuery.trim())}`)
            setSearchQuery('')
            setShowDropdown(false)
        }
    }

    const handleMobileSearch = (e) => {
        e.preventDefault()
        if (mobileSearchQuery.trim()) {
            navigate(`/calculators?search=${encodeURIComponent(mobileSearchQuery.trim())}`)
            setMobileSearchQuery('')
            setIsMobileMenuOpen(false)
        }
    }

    const handleInputChange = (e) => {
        setSearchQuery(e.target.value)
        setShowDropdown(e.target.value.trim().length > 0)
    }

    const handleMobileInputChange = (e) => {
        setMobileSearchQuery(e.target.value)
    }

    const handleResultClick = () => {
        setShowDropdown(false)
        setSearchQuery('')
    }

    const handleMobileResultClick = () => {
        setMobileSearchQuery('')
        setIsMobileMenuOpen(false)
    }

    const navLinks = [
        { name: 'FINANCE', path: '/finance' },
        { name: 'HEALTH', path: '/health' },
        { name: 'MATH', path: '/math' },
    ]

    return (
        <>
            <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
                <div className="container header-container">
                    {/* Logo */}
                    <Link to="/" className="logo">
                        <span className="logo-icon">◇</span>
                        <span className="logo-text">PLAINLY</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="nav-desktop">
                        <NavLink to="/calculators" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            ALL TOOLS
                        </NavLink>
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            >
                                {link.name}
                            </NavLink>
                        ))}
                        {/* Categories Dropdown */}
                        <div className="nav-dropdown-container" ref={categoryRef}>
                            <button
                                className={`nav-link nav-dropdown-toggle ${showCategoryDropdown ? 'active' : ''}`}
                                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                            >
                                CATEGORIES
                                <ChevronDown size={14} className={`nav-dropdown-icon ${showCategoryDropdown ? 'rotate' : ''}`} />
                            </button>
                            {showCategoryDropdown && (
                                <div className="nav-dropdown-menu">
                                    {categories.map((cat) => (
                                        <Link
                                            key={cat.name}
                                            to={cat.path}
                                            className="nav-dropdown-item"
                                            onClick={() => setShowCategoryDropdown(false)}
                                        >
                                            {cat.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </nav>

                    {/* Right Actions */}
                    <div className="header-actions">
                        <div className="header-search-container" ref={searchRef}>
                            <form className="search-bar" onSubmit={handleSearch}>
                                <Search size={16} className="search-bar-icon" />
                                <input
                                    type="text"
                                    placeholder="Search instruments..."
                                    value={searchQuery}
                                    onChange={handleInputChange}
                                    onFocus={() => searchQuery.trim() && setShowDropdown(true)}
                                    className="search-bar-input"
                                />
                            </form>

                            {/* Search Dropdown */}
                            {showDropdown && filteredCalculators.length > 0 && (
                                <div className="header-search-dropdown">
                                    {filteredCalculators.map((calc) => (
                                        <Link
                                            to={calc.path}
                                            key={calc.path}
                                            className="header-search-result"
                                            onClick={handleResultClick}
                                        >
                                            <div className="header-search-result-icon">
                                                <calc.icon size={14} />
                                            </div>
                                            <div className="header-search-result-info">
                                                <span className="header-search-result-name">{calc.name}</span>
                                                <span className="header-search-result-category">{calc.category}</span>
                                            </div>
                                            <ArrowRight size={12} className="header-search-result-arrow" />
                                        </Link>
                                    ))}
                                    <Link
                                        to={`/calculators?search=${encodeURIComponent(searchQuery)}`}
                                        className="header-search-view-all"
                                        onClick={handleResultClick}
                                    >
                                        View all results →
                                    </Link>
                                </div>
                            )}
                        </div>

                        <FavoritesDropdown />

                        <button className="header-icon-btn" aria-label="Settings" onClick={openSettings}>
                            <Settings size={18} />
                        </button>

                        <a
                            href="https://buymeacoffee.com/plainlyy"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="header-bmc-link"
                        >
                            <Coffee size={16} />
                            <span>Buy me a coffee</span>
                        </a>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="mobile-menu-btn"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu - Outside header to fix backdrop-filter issue */}
            <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
                {/* Mobile Search */}
                <div className="mobile-search" ref={mobileSearchRef}>
                    <form onSubmit={handleMobileSearch}>
                        <div className="mobile-search-wrapper">
                            <Search size={18} className="mobile-search-icon" />
                            <input
                                type="text"
                                placeholder="Search calculators..."
                                value={mobileSearchQuery}
                                onChange={handleMobileInputChange}
                                className="mobile-search-input"
                            />
                        </div>
                    </form>

                    {/* Mobile Search Results */}
                    {mobileSearchQuery.trim() && mobileFilteredCalculators.length > 0 && (
                        <div className="mobile-search-results">
                            {mobileFilteredCalculators.map((calc) => (
                                <Link
                                    to={calc.path}
                                    key={calc.path}
                                    className="mobile-search-result"
                                    onClick={handleMobileResultClick}
                                >
                                    <div className="mobile-search-result-icon">
                                        <calc.icon size={18} />
                                    </div>
                                    <div className="mobile-search-result-info">
                                        <span className="mobile-search-result-name">{calc.name}</span>
                                        <span className="mobile-search-result-category">{calc.category}</span>
                                    </div>
                                    <ArrowRight size={16} />
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                <nav className="mobile-nav">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                        >
                            {link.name}
                        </NavLink>
                    ))}
                    <div className="mobile-nav-divider" />
                    <NavLink to="/calculators" className="mobile-nav-link">ALL CALCULATORS</NavLink>
                    <a
                        href="https://buymeacoffee.com/plainlyy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mobile-nav-link bmc-link"
                    >
                        <Coffee size={18} />
                        SUPPORT US
                    </a>
                </nav>
            </div>
        </>
    )
}

export default Header
