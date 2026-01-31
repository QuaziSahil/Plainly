import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, ArrowRight } from 'lucide-react'
import { allCalculators } from '../data/calculators'
import './AllCalculators.css'

const categories = ['All', 'Finance', 'Health', 'Math', 'Text', 'Tech', 'Sustainability', 'Real Estate', 'Fun', 'Converter', 'Other']

function AllCalculators() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
    const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'All')

    // Update search query and category when URL params change
    useEffect(() => {
        const urlSearch = searchParams.get('search') || ''
        const urlCategory = searchParams.get('category') || 'All'
        setSearchQuery(urlSearch)
        setActiveCategory(urlCategory)
    }, [searchParams])

    // Update URL when search query changes
    const handleSearchChange = (e) => {
        const value = e.target.value
        setSearchQuery(value)
        const newParams = {}
        if (value.trim()) newParams.search = value
        if (activeCategory !== 'All') newParams.category = activeCategory
        setSearchParams(newParams)
    }

    // Update URL when category changes
    const handleCategoryChange = (cat) => {
        setActiveCategory(cat)
        const newParams = {}
        if (searchQuery.trim()) newParams.search = searchQuery
        if (cat !== 'All') newParams.category = cat
        setSearchParams(newParams)
    }

    const filteredCalculators = allCalculators.filter(calc => {
        const matchesSearch = calc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            calc.description.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = activeCategory === 'All' || calc.category === activeCategory
        return matchesSearch && matchesCategory
    })

    return (
        <div className="all-calculators">
            <div className="container">
                {/* Filters */}
                <div className="filters-bar">
                    <div className="search-wrapper">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search calculators..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="search-input"
                        />
                    </div>
                    <div className="category-filters">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                                onClick={() => handleCategoryChange(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results Count */}
                <div className="results-info">
                    <span className="results-count">{filteredCalculators.length} Results</span>
                </div>

                {/* Calculator Grid */}
                <div className="calculators-grid">
                    {filteredCalculators.map((calc) => (
                        <Link to={calc.path} key={calc.path} className="calc-card">
                            <div className="calc-card-icon">
                                <calc.icon size={20} />
                            </div>
                            <h3 className="calc-card-title">{calc.name.replace(' Calculator', '')}</h3>
                            <p className="calc-card-description">{calc.description}</p>
                            <div className="calc-card-footer">
                                <span className="calc-card-complexity">STANDARD</span>
                                <span className="calc-card-action">
                                    LAUNCH <ArrowRight size={14} />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* No Results */}
                {filteredCalculators.length === 0 && (
                    <div className="no-results">
                        <p>No calculators found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AllCalculators
