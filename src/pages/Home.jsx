import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Calculator, Heart, Brain, ArrowRightLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { financeCalculators, healthCalculators, mathCalculators, converterCalculators, allCalculators } from '../data/calculators'
import './Home.css'

function Home() {
    const [searchQuery, setSearchQuery] = useState('')
    const [showDropdown, setShowDropdown] = useState(false)
    const searchRef = useRef(null)
    const navigate = useNavigate()

    // Get first 4 trending calculators
    const trendingCalculators = [
        financeCalculators[0], // Mortgage
        healthCalculators[0],  // BMI
        financeCalculators[2], // Compound Interest
        mathCalculators[1],    // Percentage
    ]

    const categories = [
        { name: 'Finance', icon: Calculator, path: '/finance', description: 'Financial Metrics' },
        { name: 'Wellness', icon: Heart, path: '/health', description: 'Health Analytics' },
        { name: 'Mathematics', icon: Brain, path: '/math', description: 'Metric Systems' },
        { name: 'Converter', icon: ArrowRightLeft, path: '/converter', description: 'Unit Systems' },
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
                        Calculated <span className="hero-italic">Precision.</span>
                    </h1>
                    <p className="hero-subtitle">
                        CURATED COLLECTION OF MATHEMATICAL INSTRUMENTS FOR THE<br />
                        DISCERNING PROFESSIONAL
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
