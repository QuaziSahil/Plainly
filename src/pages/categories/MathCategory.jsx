import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { mathCalculators } from '../../data/calculators'
import './CategoryPage.css'

function MathCategory() {
    const [activeFilter, setActiveFilter] = useState('all')

    const filters = [
        { id: 'all', name: 'All Instruments', count: mathCalculators.length },
        { id: 'basic', name: 'Basic Operations', count: 2 },
        { id: 'advanced', name: 'Advanced Functions', count: 2 },
    ]

    return (
        <div className="category-page">
            <div className="container">
                <div className="category-layout">
                    {/* Sidebar */}
                    <aside className="category-sidebar">
                        <div className="sidebar-section">
                            <h3 className="sidebar-title">CLASSIFICATION</h3>
                            <nav className="sidebar-nav">
                                {filters.map(filter => (
                                    <button
                                        key={filter.id}
                                        className={`sidebar-link ${activeFilter === filter.id ? 'active' : ''}`}
                                        onClick={() => setActiveFilter(filter.id)}
                                    >
                                        <span>{filter.name}</span>
                                        <span className="sidebar-count">{filter.count}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="category-main">
                        <div className="calculator-grid">
                            {mathCalculators.map((calc) => (
                                <Link to={calc.path} key={calc.name} className="calc-card">
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
                    </main>
                </div>
            </div>
        </div>
    )
}

export default MathCategory
