import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import { aiCalculators } from '../../data/calculators'
import './CategoryPage.css'

function AICategory() {
    const [activeFilter, setActiveFilter] = useState('all')

    const filters = [
        { id: 'all', name: 'All AI Tools', count: aiCalculators.length },
        { id: 'content', name: 'Content Creation', count: 12 },
        { id: 'social', name: 'Social Media', count: 6 },
        { id: 'creative', name: 'Creative Writing', count: 8 },
        { id: 'business', name: 'Business & Pro', count: 8 },
    ]

    const complexities = [
        { id: 'generator', name: 'AI Generator' },
        { id: 'assistant', name: 'AI Assistant' },
    ]

    return (
        <div className="category-page">
            <div className="container">
                {/* Category Header */}
                <div className="category-header" style={{ marginBottom: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <Sparkles size={28} style={{ color: '#a78bfa' }} />
                        <h1 style={{ fontSize: '28px', fontWeight: '700', margin: 0 }}>AI Tools</h1>
                    </div>
                    <p style={{ opacity: 0.7, fontSize: '15px', margin: 0 }}>
                        Powerful AI-powered generators for content, social media, creative writing, and business needs.
                    </p>
                </div>

                <div className="category-layout">
                    {/* Sidebar */}
                    <aside className="category-sidebar">
                        <div className="sidebar-section">
                            <h3 className="sidebar-title">CATEGORIES</h3>
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

                        <div className="sidebar-section">
                            <h3 className="sidebar-title">TYPE</h3>
                            <div className="complexity-options">
                                {complexities.map(comp => (
                                    <label key={comp.id} className="complexity-option">
                                        <input type="checkbox" />
                                        <span className="checkbox-custom"></span>
                                        <span>{comp.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="category-main">
                        <div className="calculator-grid">
                            {aiCalculators.map((calc) => (
                                <Link to={calc.path} key={calc.name} className="calc-card">
                                    <div className="calc-card-icon" style={{ background: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)' }}>
                                        <calc.icon size={20} />
                                    </div>
                                    <h3 className="calc-card-title">{calc.name.replace('AI ', '').replace(' Generator', '')}</h3>
                                    <p className="calc-card-description">{calc.description}</p>
                                    <div className="calc-card-footer">
                                        <span className="calc-card-complexity" style={{ color: '#a78bfa' }}>AI POWERED</span>
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

export default AICategory
