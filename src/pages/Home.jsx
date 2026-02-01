import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Calculator, Heart, Brain, ArrowRightLeft, ChevronRight, ArrowRight, Star, Clock, Sparkles } from 'lucide-react'
import { financeCalculators, healthCalculators, mathCalculators, converterCalculators, allCalculators, aiCalculators } from '../data/calculators'
import { useStorage } from '../context/StorageContext'
import './Home.css'

function Home() {
    const [searchQuery, setSearchQuery] = useState('')
    const [showDropdown, setShowDropdown] = useState(false)
    const searchRef = useRef(null)
    const navigate = useNavigate()

    // Get favorites and history from storage
    const { favorites, history } = useStorage()

    // Map favorite paths to calculator objects
    const favoriteCalculators = favorites
        .map(path => allCalculators.find(calc => calc.path === path))
        .filter(Boolean)
        .slice(0, 6) // Show max 6 favorites

    // Map history paths to calculator objects with timestamp
    const recentCalculators = history
        .map(item => {
            const calc = allCalculators.find(c => c.path === item.path)
            return calc ? { ...calc, timestamp: item.timestamp } : null
        })
        .filter(Boolean)
        .slice(0, 4) // Show max 4 recent

    // Get 12 trending/most useful calculators (including popular AI tools)
    const trendingCalculators = [
        financeCalculators[0],  // Mortgage Calculator
        healthCalculators[0],   // BMI Calculator
        aiCalculators.find(c => c.path === '/ai-code-generator'),  // AI Code Generator
        financeCalculators[2],  // Compound Interest
        mathCalculators[1],     // Percentage Calculator
        aiCalculators.find(c => c.path === '/ai-paraphraser'),  // AI Paraphraser
        financeCalculators[5],  // Tip Calculator
        healthCalculators[1],   // Calorie Calculator
        aiCalculators.find(c => c.path === '/ai-email-generator'),  // AI Email Generator
        converterCalculators[0], // Unit Converter
        financeCalculators[9],  // Retirement Calculator
        aiCalculators.find(c => c.path === '/ai-code-debugger'),  // AI Code Debugger
    ].filter(Boolean)

    // Get latest 8 tools (newest AI Code tools)
    const latestTools = [
        aiCalculators.find(c => c.path === '/ai-code-generator'),
        aiCalculators.find(c => c.path === '/ai-code-debugger'),
        aiCalculators.find(c => c.path === '/ai-code-explainer'),
        aiCalculators.find(c => c.path === '/ai-sql-generator'),
        aiCalculators.find(c => c.path === '/ai-regex-generator'),
        aiCalculators.find(c => c.path === '/ai-react-component-generator'),
        aiCalculators.find(c => c.path === '/ai-unit-test-generator'),
        aiCalculators.find(c => c.path === '/ai-tech-stack-recommender'),
    ].filter(Boolean).slice(0, 8)

    const categories = [
        { name: 'Finance', icon: Calculator, path: '/finance', description: 'Financial Metrics' },
        { name: 'Wellness', icon: Heart, path: '/health', description: 'Health Analytics' },
        { name: 'Mathematics', icon: Brain, path: '/math', description: 'Metric Systems' },
        { name: 'Converter', icon: ArrowRightLeft, path: '/converter', description: 'Unit Systems' },
        { name: 'AI Tools', icon: Sparkles, path: '/ai', description: 'AI Generators' },
    ]

    // Filter calculators based on search query
    const filteredCalculators = searchQuery.trim()
        ? allCalculators.filter(calc =>
            calc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            calc.description.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 5) // Show max 5 results
        : []

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowDropdown(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/calculators?search=${encodeURIComponent(searchQuery.trim())}`)
            setShowDropdown(false)
        }
    }

    const handleInputChange = (e) => {
        setSearchQuery(e.target.value)
        setShowDropdown(e.target.value.trim().length > 0)
    }

    const handleResultClick = () => {
        setShowDropdown(false)
        setSearchQuery('')
    }

    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <h1 className="hero-title">
                        Make the complex, <span className="hero-italic">plainly simple.</span>
                    </h1>
                    <p className="hero-subtitle">
                        TOOLS THAT TURN DIFFICULT PROBLEMS INTO<br />
                        CLEAR ANSWERS
                    </p>

                    {/* Search Bar with Dropdown */}
                    <div className="hero-search-container" ref={searchRef}>
                        <form className="hero-search" onSubmit={handleSearch}>
                            <Search className="search-icon" size={18} />
                            <input
                                type="text"
                                placeholder="Find an instrument..."
                                className="search-input"
                                value={searchQuery}
                                onChange={handleInputChange}
                                onFocus={() => searchQuery.trim() && setShowDropdown(true)}
                            />
                        </form>

                        {/* Search Dropdown */}
                        {showDropdown && filteredCalculators.length > 0 && (
                            <div className="search-dropdown">
                                {filteredCalculators.map((calc) => (
                                    <Link
                                        to={calc.path}
                                        key={calc.path}
                                        className="search-result"
                                        onClick={handleResultClick}
                                    >
                                        <div className="search-result-icon">
                                            <calc.icon size={16} />
                                        </div>
                                        <div className="search-result-info">
                                            <span className="search-result-name">{calc.name}</span>
                                            <span className="search-result-category">{calc.category}</span>
                                        </div>
                                        <ArrowRight size={14} className="search-result-arrow" />
                                    </Link>
                                ))}
                                <Link
                                    to={`/calculators?search=${encodeURIComponent(searchQuery)}`}
                                    className="search-view-all"
                                    onClick={handleResultClick}
                                >
                                    View all results →
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* For You Section - Only show if user has favorites or history */}
            {(favoriteCalculators.length > 0 || recentCalculators.length > 0) && (
                <section className="for-you-section">
                    <div className="container">
                        <div className="section-header">
                            <div>
                                <h2 className="section-title">For You</h2>
                                <p className="section-subtitle">PERSONALIZED QUICK ACCESS</p>
                            </div>
                        </div>

                        {/* Favorites Row */}
                        {favoriteCalculators.length > 0 && (
                            <div className="for-you-block">
                                <div className="for-you-label">
                                    <Star size={14} />
                                    <span>Your Favorites</span>
                                </div>
                                <div className="favorites-grid">
                                    {favoriteCalculators.map((calc) => (
                                        <Link to={calc.path} key={calc.path} className="favorite-card">
                                            <div className="favorite-icon">
                                                <calc.icon size={18} />
                                            </div>
                                            <span className="favorite-name">{calc.name.replace(' Calculator', '')}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Recent Activity Row */}
                        {recentCalculators.length > 0 && (
                            <div className="for-you-block">
                                <div className="for-you-label">
                                    <Clock size={14} />
                                    <span>Recent Activity</span>
                                </div>
                                <div className="recent-list">
                                    {recentCalculators.map((calc) => (
                                        <Link to={calc.path} key={calc.path} className="recent-item">
                                            <div className="recent-icon">
                                                <calc.icon size={16} />
                                            </div>
                                            <div className="recent-info">
                                                <span className="recent-name">{calc.name}</span>
                                                <span className="recent-category">{calc.category}</span>
                                            </div>
                                            <ArrowRight size={14} className="recent-arrow" />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Categories Section */}
            <section className="categories-section">
                <div className="container">
                    <div className="section-header">
                        <div>
                            <h2 className="section-title">Categories</h2>
                            <p className="section-subtitle">DEPARTMENTAL DIRECTORY</p>
                        </div>
                        <Link to="/calculators" className="expand-link">
                            EXPAND ALL <ChevronRight size={14} />
                        </Link>
                    </div>

                    <div className="category-grid">
                        {categories.map((category) => (
                            <Link to={category.path} key={category.name} className="category-card">
                                <div className="category-icon">
                                    <category.icon size={24} />
                                </div>
                                <span className="category-name">{category.name.toUpperCase()}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Latest Tools Section */}
            <section className="latest-section">
                <div className="container">
                    <div className="section-header">
                        <div>
                            <h2 className="section-title">
                                Latest Tools
                                <span className="new-badge">NEW</span>
                            </h2>
                            <p className="section-subtitle">RECENTLY ADDED INSTRUMENTS</p>
                        </div>
                        <Link to="/calculators?category=AI" className="expand-link">
                            VIEW ALL <ChevronRight size={14} />
                        </Link>
                    </div>

                    <div className="latest-grid">
                        {latestTools.map((calc) => (
                            <Link to={calc.path} key={calc.path} className="latest-card">
                                <div className="latest-icon">
                                    <calc.icon size={20} />
                                </div>
                                <div className="latest-content">
                                    <h3 className="latest-name">{calc.name}</h3>
                                    <p className="latest-description">{calc.description}</p>
                                </div>
                                <ArrowRight size={16} className="latest-arrow" />
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trending Section */}
            <section className="trending-section">
                <div className="container">
                    <h2 className="section-title">Trending Now</h2>

                    <div className="trending-grid">
                        {trendingCalculators.map((calc, index) => (
                            <Link to={calc.path} key={calc.name} className="trending-card">
                                <div className="trending-icon">
                                    <calc.icon size={20} />
                                </div>
                                <h3 className="trending-name">{calc.name.replace(' Calculator', '')}</h3>
                                <p className="trending-description">{calc.description}</p>
                                <div className="trending-footer">
                                    <span className="trending-complexity">STANDARD</span>
                                    <span className="trending-action">
                                        LAUNCH <ArrowRight size={14} />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Home
